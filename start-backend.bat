@echo off
echo =========================================
echo   Employee Loan Management System
echo   Starting Backend (Spring Boot)
echo =========================================
echo.

cd /d "%~dp0backend"

REM Check if Maven is installed
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Maven is not installed. Please install Maven 3.6+ first.
    pause
    exit /b 1
)

REM Check if Java is installed
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Java is not installed. Please install Java 17+ first.
    pause
    exit /b 1
)

echo + Maven and Java found!
echo.

REM Build the project
echo Building the project...
call mvn clean install -DskipTests

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Build successful!
    echo.
    echo Starting Spring Boot application...
    echo Backend will be available at: http://localhost:8080
    echo.
    echo Press Ctrl+C to stop the server
    echo =========================================
    echo.
    
    REM Run the application
    call mvn spring-boot:run
) else (
    echo.
    echo Build failed. Please check the error messages above.
    pause
    exit /b 1
)
