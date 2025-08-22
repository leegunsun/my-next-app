import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../lib/firebase/config'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
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
  downloadUrl: string
  storagePath: string
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

    try {
      // Check for existing resume and delete it from Firebase Storage
      const currentResumeDocRef = doc(db, 'portfolio-resume-files', 'current')
      const currentResumeDoc = await getDoc(currentResumeDocRef)
      
      if (currentResumeDoc.exists()) {
        const currentData = currentResumeDoc.data() as ResumeFileData
        if (currentData.storagePath) {
          try {
            const oldFileRef = ref(storage, currentData.storagePath)
            await deleteObject(oldFileRef)
            console.log('✅ Old resume file deleted from Firebase Storage')
          } catch (deleteError) {
            console.warn('⚠️ Could not delete old file from storage (might not exist):', deleteError)
          }
        }
      }

      // Generate filename with timestamp for Firebase Storage
      const timestamp = Date.now()
      const filename = `resume-${timestamp}.pdf`
      const storagePath = `resumes/${filename}`
      
      // Create Firebase Storage reference
      const storageRef = ref(storage, storagePath)
      
      // Convert file to buffer for upload
      const bytes = await file.arrayBuffer()
      const buffer = new Uint8Array(bytes)

      // Upload to Firebase Storage with metadata
      const uploadTask = uploadBytesResumable(storageRef, buffer, {
        contentType: 'application/pdf',
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      })

      // Wait for upload completion
      await new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // Progress monitoring could be added here
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log(`Upload progress: ${progress}%`)
          },
          (error) => {
            console.error('Upload error:', error)
            reject(error)
          },
          () => {
            console.log('Upload completed successfully')
            resolve(null)
          }
        )
      })

      // Get download URL
      const downloadUrl = await getDownloadURL(storageRef)

      // Save file info to Firestore
      const fileData: ResumeFileData = {
        id: `resume-${timestamp}`,
        filename: filename,
        originalName: file.name,
        uploadDate: new Date().toISOString(),
        isActive: true,
        fileSize: file.size,
        downloadUrl: downloadUrl,
        storagePath: storagePath,
        contentType: 'application/pdf'
      }

      // Save to Firestore
      await setDoc(currentResumeDocRef, fileData)

      console.log('✅ PDF resume uploaded successfully to Firebase Storage:', filename)
      console.log('📄 Download URL:', downloadUrl)

      return NextResponse.json({
        success: true,
        data: fileData,
        message: '이력서 PDF가 Firebase Storage에 성공적으로 업로드되었습니다.'
      })

    } catch (firebaseError) {
      console.error('❌ Firebase operation failed:', firebaseError)
      
      return NextResponse.json({
        success: false,
        message: `Firebase Storage 업로드 중 오류가 발생했습니다: ${firebaseError instanceof Error ? firebaseError.message : 'Unknown Firebase error'}`,
        error: firebaseError instanceof Error ? firebaseError.message : 'Unknown Firebase error'
      }, { status: 500 })
    }

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

// GET current resume file info from Firestore
export async function GET() {
  try {
    const currentResumeDocRef = doc(db, 'portfolio-resume-files', 'current')
    const currentResumeDoc = await getDoc(currentResumeDocRef)
    
    if (!currentResumeDoc.exists()) {
      return NextResponse.json({
        success: false,
        message: '등록된 이력서가 없습니다.'
      }, { status: 404 })
    }

    const data = currentResumeDoc.data() as ResumeFileData
    
    // Verify the file still exists in Firebase Storage
    try {
      const storageRef = ref(storage, data.storagePath)
      // Test if we can still get the download URL (this will fail if file doesn't exist)
      await getDownloadURL(storageRef)
    } catch (storageError) {
      console.warn('⚠️ File exists in Firestore but not in Storage, cleaning up...')
      // Clean up Firestore record if file doesn't exist in storage
      await currentResumeDocRef.delete()
      return NextResponse.json({
        success: false,
        message: '등록된 이력서가 없습니다.'
      }, { status: 404 })
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