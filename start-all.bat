@echo off
echo =========================================
echo   Employee Loan Management System
echo   Starting Backend and Frontend
echo =========================================
echo.

REM Get the directory where the script is located
set SCRIPT_DIR=%~dp0

echo Starting Backend in new window...
start "ELMS Backend" cmd /k "cd /d %SCRIPT_DIR% && start-backend.bat"

echo.
echo Waiting 3 seconds before starting frontend...
timeout /t 3 /nobreak >nul

echo Starting Frontend in new window...
start "ELMS Frontend" cmd /k "cd /d %SCRIPT_DIR% && start-frontend.bat"

echo.
echo =========================================
echo Both services are starting!
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Default Login:
echo   Admin: admin@unilak.ac.rw / admin123
echo   Employee: john.doe@unilak.ac.rw / employee123
echo.
echo Press Ctrl+C in each window to stop the services
echo =========================================
echo.

pause
