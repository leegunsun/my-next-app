// This endpoint has been removed as it was unused and causing build errors
// If you need Firebase Admin functionality, install firebase-admin and implement here

export async function GET() {
  return Response.json({ 
    error: 'This endpoint has been disabled' 
  }, { status: 404 })
}

export async function POST() {
  return Response.json({ 
    error: 'This endpoint has been disabled' 
  }, { status: 404 })
}