#!/bin/bash

echo "========================================="
echo "  Employee Loan Management System"
echo "  Starting Backend and Frontend"
echo "========================================="
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Function to detect OS and terminal emulator
start_backend() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR' && ./start-backend.sh\""
    elif command -v gnome-terminal &> /dev/null; then
        # Linux with GNOME Terminal
        gnome-terminal --title="ELMS Backend" -- bash -c "cd '$SCRIPT_DIR' && ./start-backend.sh; exec bash"
    elif command -v xterm &> /dev/null; then
        # Linux with xterm
        xterm -T "ELMS Backend" -e "cd '$SCRIPT_DIR' && ./start-backend.sh; bash" &
    elif command -v konsole &> /dev/null; then
        # Linux with KDE Konsole
        konsole --title "ELMS Backend" -e "cd '$SCRIPT_DIR' && ./start-backend.sh" &
    elif command -v x-terminal-emulator &> /dev/null; then
        # Generic Linux terminal
        x-terminal-emulator -e "cd '$SCRIPT_DIR' && ./start-backend.sh" &
    else
        echo "❌ Could not detect terminal emulator. Please start backend manually:"
        echo "   ./start-backend.sh"
        return 1
    fi
}

start_frontend() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR' && ./start-frontend.sh\""
    elif command -v gnome-terminal &> /dev/null; then
        # Linux with GNOME Terminal
        gnome-terminal --title="ELMS Frontend" -- bash -c "cd '$SCRIPT_DIR' && ./start-frontend.sh; exec bash"
    elif command -v xterm &> /dev/null; then
        # Linux with xterm
        xterm -T "ELMS Frontend" -e "cd '$SCRIPT_DIR' && ./start-frontend.sh; bash" &
    elif command -v konsole &> /dev/null; then
        # Linux with KDE Konsole
        konsole --title "ELMS Frontend" -e "cd '$SCRIPT_DIR' && ./start-frontend.sh" &
    elif command -v x-terminal-emulator &> /dev/null; then
        # Generic Linux terminal
        x-terminal-emulator -e "cd '$SCRIPT_DIR' && ./start-frontend.sh" &
    else
        echo "❌ Could not detect terminal emulator. Please start frontend manually:"
        echo "   ./start-frontend.sh"
        return 1
    fi
}

# Make individual scripts executable
chmod +x "$SCRIPT_DIR/start-backend.sh" 2>/dev/null
chmod +x "$SCRIPT_DIR/start-frontend.sh" 2>/dev/null

echo "🚀 Launching Backend in new terminal..."
start_backend
if [ $? -eq 0 ]; then
    echo "✅ Backend terminal opened"
else
    exit 1
fi

echo ""
echo "⏳ Waiting 3 seconds before starting frontend..."
sleep 3

echo "🚀 Launching Frontend in new terminal..."
start_frontend
if [ $? -eq 0 ]; then
    echo "✅ Frontend terminal opened"
else
    exit 1
fi

echo ""
echo "========================================="
echo "✅ Both services are starting!"
echo ""
echo "📍 Backend:  http://localhost:8080"
echo "📍 Frontend: http://localhost:5173"
echo ""
echo "Default Login:"
echo "  Admin: admin@unilak.ac.rw / admin123"
echo "  Employee: john.doe@unilak.ac.rw / employee123"
echo ""
echo "Press Ctrl+C in each terminal to stop the services"
echo "========================================="
