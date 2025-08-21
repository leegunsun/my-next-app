import { NextRequest, NextResponse } from 'next/server'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import app from '../../../../lib/firebase/config'
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
  storagePath: string
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

    // Initialize Firebase Storage
    const storage = getStorage(app)
    
    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const filename = `resume-${timestamp}.pdf`
    const storagePath = `resumes/${filename}`
    
    // Create storage reference
    const storageRef = ref(storage, storagePath)
    
    // Convert file to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    
    // Upload metadata
    const metadata = {
      contentType: 'application/pdf',
      customMetadata: {
        originalName: file.name,
        uploadDate: new Date().toISOString(),
        version: 'current'
      }
    }

    console.log('🔄 Starting Firebase Storage upload:', storagePath)

    // Upload file to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, arrayBuffer, metadata)
    
    console.log('✅ Upload successful:', uploadResult.metadata.fullPath)

    // Get download URL
    const downloadUrl = await getDownloadURL(storageRef)
    
    console.log('🔗 Download URL generated:', downloadUrl)

    // Backup current resume if exists
    const currentResumeDocRef = doc(db, 'portfolio-resume-files', 'current')
    const currentResumeDoc = await getDoc(currentResumeDocRef)
    
    if (currentResumeDoc.exists()) {
      const currentData = currentResumeDoc.data() as ResumeFileData
      const backupData = {
        ...currentData,
        id: `backup-${timestamp}`,
        isActive: false,
        backupDate: new Date().toISOString()
      }
      
      const backupDocRef = doc(db, 'portfolio-resume-files', `backup-${timestamp}`)
      await setDoc(backupDocRef, backupData)
      console.log('📦 Previous resume backed up:', backupData.id)
    }

    // Save new file info to Firebase Firestore
    const fileData: ResumeFileData = {
      id: `resume-${timestamp}`,
      filename: filename,
      originalName: file.name,
      uploadDate: new Date().toISOString(),
      isActive: true,
      fileSize: file.size,
      fileUrl: downloadUrl,
      contentType: 'application/pdf',
      storagePath: storagePath
    }

    // Save to Firestore
    await setDoc(currentResumeDocRef, fileData)

    console.log('✅ Firebase Storage PDF resume uploaded successfully:', filename)

    return NextResponse.json({
      success: true,
      data: fileData,
      message: '이력서 PDF가 Firebase Storage에 성공적으로 업로드되었습니다.'
    })

  } catch (error) {
    console.error('❌ Firebase Storage upload error:', error)
    
    // Enhanced error logging for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json({
      success: false,
      message: `Firebase Storage PDF 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET current resume file info (same as before)
export async function GET() {
  try {
    const resumeFileDocRef = doc(db, 'portfolio-resume-files', 'current')
    const resumeFileDoc = await getDoc(resumeFileDocRef)
    
    if (!resumeFileDoc.exists()) {
      return NextResponse.json({
        success: false,
        message: '등록된 이력서가 없습니다.'
      }, { status: 404 })
    }

    const data = resumeFileDoc.data() as ResumeFileData
    
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