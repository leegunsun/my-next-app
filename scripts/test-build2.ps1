# Clean and test build script for Next.js
Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Testing Next.js build..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build succeeded!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Build failed with exit code: $LASTEXITCODE" -ForegroundColor Red
}