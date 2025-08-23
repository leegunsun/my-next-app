// This endpoint has been removed as it was a duplicate and unused
// The main resume upload functionality should be handled by /api/portfolio/resume-upload

export async function GET() {
  return Response.json({ 
    error: 'This endpoint has been disabled - use /api/portfolio/resume-upload instead' 
  }, { status: 404 })
}

export async function POST() {
  return Response.json({ 
    error: 'This endpoint has been disabled - use /api/portfolio/resume-upload instead' 
  }, { status: 404 })
}