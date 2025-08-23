# Lighthouse Performance Audit Script
Write-Host "=== Lighthouse Performance Audit ===" -ForegroundColor Green

Write-Host "`nStep 1: Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "`nStep 2: Building the application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build application" -ForegroundColor Red
    exit 1
}

Write-Host "`nStep 3: Running Lighthouse CI performance audit..." -ForegroundColor Yellow
Write-Host "This will test the following URLs:" -ForegroundColor Cyan
Write-Host "- http://localhost:3000 (Homepage)" -ForegroundColor Cyan
Write-Host "- http://localhost:3000/admin (Admin area)" -ForegroundColor Cyan  
Write-Host "- http://localhost:3000/dev-gate (Development gate)" -ForegroundColor Cyan

npx @lhci/cli@0.15.x autorun

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Performance audit completed successfully!" -ForegroundColor Green
    Write-Host "Check the generated reports for detailed analysis." -ForegroundColor Green
} else {
    Write-Host "`n❌ Performance audit failed or had issues." -ForegroundColor Red
    Write-Host "Check the output above for details." -ForegroundColor Red
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")