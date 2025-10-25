@echo off
echo =========================================
echo   Employee Loan Management System
echo   Starting Frontend (React + Vite)
echo =========================================
echo.

cd /d "%~dp0frontend"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo + Node.js found!
echo.

REM Check for pnpm, otherwise use npm
where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set PACKAGE_MANAGER=pnpm
    echo + pnpm found!
) else (
    where npm >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        set PACKAGE_MANAGER=npm
        echo + npm found (pnpm is recommended for faster installs)
    ) else (
        echo X No package manager found. Please install npm or pnpm.
        pause
        exit /b 1
    )
)

echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo Installing dependencies...
    call %PACKAGE_MANAGER% install
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Dependency installation failed.
        pause
        exit /b 1
    )
    echo.
)

echo Dependencies ready!
echo.
echo Starting development server...
echo Frontend will be available at: http://localhost:5173
echo.
echo Default Login Credentials:
echo   Admin: admin@unilak.ac.rw / admin123
echo   Employee: john.doe@unilak.ac.rw / employee123
echo.
echo Press Ctrl+C to stop the server
echo =========================================
echo.

REM Run the development server
if "%PACKAGE_MANAGER%"=="pnpm" (
    call pnpm dev
) else (
    call npm run dev
)
