# Complete clean and build script for Next.js
Write-Host "`n=== Next.js Clean Build Script ===" -ForegroundColor Cyan
Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow

# Remove .next directory
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed .next directory" -ForegroundColor Green
}

# Remove node_modules cache
if (Test-Path "node_modules\.cache") {
    Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Cleared node_modules cache" -ForegroundColor Green
}

Write-Host "`nStarting Next.js build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build completed successfully!" -ForegroundColor Green
    Write-Host "You can now run 'npm start' to start the production server" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Build failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Please check the error messages above for details" -ForegroundColor Yellow
}