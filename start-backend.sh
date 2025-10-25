#!/bin/bash

echo "========================================="
echo "  Employee Loan Management System"
echo "  Starting Backend (Spring Boot)"
echo "========================================="
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6+ first."
    exit 1
fi

# Check Java version
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17+ first."
    exit 1
fi

echo "✓ Maven found: $(mvn -version | head -n 1)"
echo "✓ Java found: $(java -version 2>&1 | head -n 1)"
echo ""

# Build the project (skip tests for faster startup)
echo "📦 Building the project..."
mvn clean install -DskipTests

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting Spring Boot application..."
    echo "📍 Backend will be available at: http://localhost:8080"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "========================================="
    echo ""
    
    # Run the application
    mvn spring-boot:run
else
    echo ""
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi
