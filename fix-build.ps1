# Fix Next.js EPERM Build Error
# This script resolves Windows permission issues with .next directory

Write-Host "🔧 Fixing Next.js build EPERM error..." -ForegroundColor Yellow

# Stop any running Node.js processes
Write-Host "1. Stopping Node.js processes..." -ForegroundColor Cyan
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Remove .next directory completely
Write-Host "2. Removing .next directory..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ .next directory removed" -ForegroundColor Green
} else {
    Write-Host "   ℹ️ .next directory not found" -ForegroundColor Gray
}

# Remove node_modules/.cache if exists
Write-Host "3. Clearing Next.js cache..." -ForegroundColor Cyan
if (Test-Path "node_modules\.cache") {
    Remove-Item "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ Node modules cache cleared" -ForegroundColor Green
}

# Remove TypeScript build info
Write-Host "4. Clearing TypeScript cache..." -ForegroundColor Cyan
if (Test-Path "tsconfig.tsbuildinfo") {
    Remove-Item "tsconfig.tsbuildinfo" -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ TypeScript build info cleared" -ForegroundColor Green
}

# Clear npm cache
Write-Host "5. Clearing npm cache..." -ForegroundColor Cyan
npm cache clean --force 2>$null
Write-Host "   ✅ npm cache cleared" -ForegroundColor Green

# Set appropriate permissions for current directory
Write-Host "6. Setting directory permissions..." -ForegroundColor Cyan
$acl = Get-Acl .
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule([System.Security.Principal.WindowsIdentity]::GetCurrent().Name, "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
$acl.SetAccessRule($accessRule)
Set-Acl . $acl
Write-Host "   ✅ Directory permissions set" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 Ready to build! Running npm run build..." -ForegroundColor Green
Write-Host ""

# Run the build
npm run build