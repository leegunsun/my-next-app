@echo off
echo Testing Next.js build...
npm run build
if %ERRORLEVEL% EQU 0 (
    echo Build succeeded!
) else (
    echo Build failed!
)