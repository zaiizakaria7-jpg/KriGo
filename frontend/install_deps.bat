@echo off
echo Installing dependencies...
call npm install "react-leaflet@^4.2.1" leaflet --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    exit /b %errorlevel%
)
call npm install -D @types/leaflet
if %errorlevel% neq 0 (
    echo Failed to install types
    exit /b %errorlevel%
)
echo Done!
