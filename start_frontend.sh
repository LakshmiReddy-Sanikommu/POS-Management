#!/bin/bash

echo "🚀 Starting Gas Station Frontend Application"
echo "==========================================="

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm is not installed. Please install Node.js first."
    echo "📋 Download from: https://nodejs.org/"
    exit 1
fi

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📋 Installing dependencies..."
    npm install
fi

echo "📋 Starting React development server..."
echo "📊 Frontend will be available at: http://localhost:3000"
echo "📊 Backend API should be running at: http://localhost:8080/api"
echo ""

# Start the React app
npm start 