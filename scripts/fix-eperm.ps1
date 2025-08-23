# Fix EPERM build error by clearing all caches and locks
Write-Host "=== Fixing Next.js EPERM Error ===" -ForegroundColor Cyan

# Stop any running Node.js processes
Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Remove .next directory completely
Write-Host "Removing .next directory..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "  ✓ .next directory removed" -ForegroundColor Green
}

# Remove TypeScript build info
Write-Host "Removing TypeScript build cache..." -ForegroundColor Yellow
if (Test-Path "tsconfig.tsbuildinfo") {
    Remove-Item -Path "tsconfig.tsbuildinfo" -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ TypeScript cache cleared" -ForegroundColor Green
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>$null

# Clear Next.js cache
Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
npx next telemetry disable 2>$null

Write-Host "`nAttempting build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Build still failing. Try restarting your terminal or IDE." -ForegroundColor Red
}