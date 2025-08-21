import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { db } from '../../../../lib/firebase/config'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const runtime = 'nodejs'

interface ResumeFileData {
  id: string
  filename: string
  originalName: string
  uploadDate: string
  isActive: boolean
  fileSize: number
  fileUrl: string
  contentType: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'PDF 파일이 선택되지 않았습니다.'
      }, { status: 400 })
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({
        success: false,
        message: 'PDF 파일만 업로드 가능합니다.'
      }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: '파일 크기는 10MB 이하만 허용됩니다.'
      }, { status: 400 })
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads/resumes')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate filename with timestamp
    const timestamp = Date.now()
    const filename = `resume-${timestamp}.pdf`
    const filepath = path.join(uploadDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Backup current resume if exists (rename to backup)
    const currentResumePath = path.join(uploadDir, 'current-resume.pdf')
    if (existsSync(currentResumePath)) {
      const backupFilename = `backup-resume-${timestamp}.pdf`
      const backupPath = path.join(uploadDir, backupFilename)
      const { readFile } = await import('fs/promises')
      await writeFile(backupPath, await readFile(currentResumePath))
    }

    // Copy uploaded file as current resume
    await writeFile(currentResumePath, buffer)

    // Save file info to Firebase
    const fileData: ResumeFileData = {
      id: `resume-${timestamp}`,
      filename: filename,
      originalName: file.name,
      uploadDate: new Date().toISOString(),
      isActive: true,
      fileSize: file.size,
      fileUrl: `/uploads/resumes/current-resume.pdf`,
      contentType: 'application/pdf'
    }

    // Skip Firestore for testing - just return success with file data
    // const resumeFileDocRef = doc(db, 'portfolio-resume-files', 'current')
    // await setDoc(resumeFileDocRef, fileData)

    console.log('✅ PDF resume uploaded successfully:', filename)

    return NextResponse.json({
      success: true,
      data: fileData,
      message: '이력서 PDF가 성공적으로 업로드되었습니다.'
    })

  } catch (error) {
    console.error('❌ Error uploading resume PDF:', error)
    
    // Enhanced error logging for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json({
      success: false,
      message: `PDF 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET current resume file info
export async function GET() {
  try {
    // Check if current resume file exists locally
    const currentResumePath = path.join(process.cwd(), 'public/uploads/resumes/current-resume.pdf')
    if (!existsSync(currentResumePath)) {
      return NextResponse.json({
        success: false,
        message: '등록된 이력서가 없습니다.'
      }, { status: 404 })
    }

    const { stat } = await import('fs/promises')
    const fileStats = await stat(currentResumePath)
    
    const data: ResumeFileData = {
      id: 'current-local',
      filename: 'current-resume.pdf',
      originalName: 'current-resume.pdf',
      uploadDate: fileStats.mtime.toISOString(),
      isActive: true,
      fileSize: fileStats.size,
      fileUrl: `/uploads/resumes/current-resume.pdf`,
      contentType: 'application/pdf'
    }
    
    return NextResponse.json({
      success: true,
      data,
      message: '이력서 정보를 가져왔습니다.'
    })
  } catch (error) {
    console.error('Error fetching resume file info:', error)
    return NextResponse.json({
      success: false,
      message: '이력서 정보를 가져오는데 실패했습니다.'
    }, { status: 500 })
  }
}