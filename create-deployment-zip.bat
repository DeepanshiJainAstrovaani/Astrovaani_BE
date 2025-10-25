@echo off
echo === Creating AstroVaani Backend Deployment ZIP ===
echo.

REM Create deployment directory if it doesn't exist
if not exist "deployment_package" mkdir deployment_package

REM Copy essential files
echo Copying essential files...
copy server.js deployment_package\ 2>nul
copy package.json deployment_package\ 2>nul
copy .env deployment_package\ 2>nul
copy test-db-connection.js deployment_package\ 2>nul
copy ecosystem.config.js deployment_package\ 2>nul

REM Copy directories
echo Copying directories...
if exist "config" (
    xcopy config deployment_package\config\ /s /e /i /q
    echo - config/ folder copied
)

if exist "controllers" (
    xcopy controllers deployment_package\controllers\ /s /e /i /q
    echo - controllers/ folder copied
)

if exist "models" (
    xcopy models deployment_package\models\ /s /e /i /q
    echo - models/ folder copied
)

if exist "routes" (
    xcopy routes deployment_package\routes\ /s /e /i /q
    echo - routes/ folder copied
)

if exist "middleware" (
    xcopy middleware deployment_package\middleware\ /s /e /i /q
    echo - middleware/ folder copied
)

if exist "utils" (
    xcopy utils deployment_package\utils\ /s /e /i /q
    echo - utils/ folder copied
)

echo.
echo === Files ready in deployment_package folder ===
echo.
echo Next steps:
echo 1. Right-click on 'deployment_package' folder
echo 2. Select "Send to" - "Compressed (zipped) folder"
echo 3. Name it: astrovaani-backend.zip
echo 4. Upload this ZIP to CyberPanel File Manager
echo 5. Extract it in public_html directory
echo.
pause
