@echo off
echo Cleaning up problematic test directories...

if exist "app\dev-gate\test-login" (
    rmdir /s /q "app\dev-gate\test-login"
    echo ✓ Removed app\dev-gate\test-login
) else (
    echo ⚠ app\dev-gate\test-login not found
)

if exist "app\mobile-auth-test" (
    rmdir /s /q "app\mobile-auth-test"
    echo ✓ Removed app\mobile-auth-test
) else (
    echo ⚠ app\mobile-auth-test not found
)

if exist "app\test-admin-header" (
    rmdir /s /q "app\test-admin-header"
    echo ✓ Removed app\test-admin-header
) else (
    echo ⚠ app\test-admin-header not found
)

if exist "app\test-admin-stats" (
    rmdir /s /q "app\test-admin-stats"
    echo ✓ Removed app\test-admin-stats
) else (
    echo ⚠ app\test-admin-stats not found
)

if exist "app\test-breadcrumb" (
    rmdir /s /q "app\test-breadcrumb"
    echo ✓ Removed app\test-breadcrumb
) else (
    echo ⚠ app\test-breadcrumb not found
)

if exist "app\test-search" (
    rmdir /s /q "app\test-search"
    echo ✓ Removed app\test-search
) else (
    echo ⚠ app\test-search not found
)

if exist "app\test-search-fixed" (
    rmdir /s /q "app\test-search-fixed"
    echo ✓ Removed app\test-search-fixed
) else (
    echo ⚠ app\test-search-fixed not found
)

if exist "app\test-select" (
    rmdir /s /q "app\test-select"
    echo ✓ Removed app\test-select
) else (
    echo ⚠ app\test-select not found
)

if exist "app\test-select-layer" (
    rmdir /s /q "app\test-select-layer"
    echo ✓ Removed app\test-select-layer
) else (
    echo ⚠ app\test-select-layer not found
)

echo.
echo Cleaning Next.js build cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✓ Removed .next directory
) else (
    echo ⚠ .next directory not found
)

echo.
echo Cleanup complete! Now run: npm run dev
pause