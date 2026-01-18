@echo off
echo ===================================
echo Vercel Deployment Fix - Build Test
echo ===================================
echo.

echo Step 1: Checking Node version...
node --version
echo.

echo Step 2: Checking NPM version...
npm --version
echo.

echo Step 3: Running type check (optional)...
call npm run type-check
echo.

echo Step 4: Running production build...
call npm run build
echo.

if %ERRORLEVEL% EQU 0 (
    echo ===================================
    echo ✓ Build successful!
    echo ===================================
    echo.
    echo Next steps:
    echo 1. Review dist/ folder
    echo 2. Push changes to GitHub
    echo 3. Vercel will auto-deploy
    echo.
) else (
    echo ===================================
    echo ✗ Build failed with error code %ERRORLEVEL%
    echo ===================================
    echo.
    echo Please check the errors above and:
    echo 1. Fix any TypeScript errors
    echo 2. Run 'npm install' if dependencies are missing
    echo 3. Check VERCEL_FIXES_COMPLETE.md for troubleshooting
    echo.
)

pause
