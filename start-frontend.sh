#!/bin/bash

echo "========================================="
echo "  Employee Loan Management System"
echo "  Starting Frontend (React + Vite)"
echo "========================================="
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js found: $(node -v)"
echo ""

# Check if pnpm is installed, if not use npm
if command -v pnpm &> /dev/null; then
    echo "✓ pnpm found: $(pnpm -v)"
    PACKAGE_MANAGER="pnpm"
elif command -v npm &> /dev/null; then
    echo "✓ npm found: $(npm -v)"
    echo "ℹ️  Using npm (pnpm is recommended for faster installs)"
    PACKAGE_MANAGER="npm"
else
    echo "❌ No package manager found. Please install npm or pnpm."
    exit 1
fi

echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    $PACKAGE_MANAGER install
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Dependency installation failed."
        exit 1
    fi
    echo ""
fi

echo "✅ Dependencies ready!"
echo ""
echo "🚀 Starting development server..."
echo "📍 Frontend will be available at: http://localhost:5173"
echo ""
echo "Default Login Credentials:"
echo "  Admin: admin@unilak.ac.rw / admin123"
echo "  Employee: john.doe@unilak.ac.rw / employee123"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================="
echo ""

# Run the development server
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm dev
else
    npm run dev
fi
