#!/bin/bash

# AWS CloudWatch Log Management Application Startup Script

echo "🚀 Starting AWS CloudWatch Log Management Application..."

# Check if .NET is installed
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK is not installed. Please install .NET 8 SDK."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Start backend in background
echo "🔧 Starting ASP.NET Core Web API..."
cd AWSLogsApp.Api
dotnet run --urls="http://localhost:5000" &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 5

# Start frontend
echo "🎨 Starting React frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Application started successfully!"
echo ""
echo "📍 Backend API: http://localhost:5000"
echo "📍 Frontend:    http://localhost:3000"
echo "📍 API Docs:    http://localhost:5000/swagger"
echo ""
echo "Press Ctrl+C to stop both applications"

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping applications..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Applications stopped"
    exit 0
}

# Set trap to catch Ctrl+C
trap cleanup SIGINT

# Wait for processes
wait