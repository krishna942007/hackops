#!/bin/bash
# StudyFlow Setup Script
# Run: chmod +x setup.sh && ./setup.sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🎓 StudyFlow — Setup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Install backend deps
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install
cd ..

# Install frontend deps
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend && npm install
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo ""
echo "Now run these in TWO separate terminals:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "  Then open: http://localhost:5173"
echo ""
echo "  ⚠️  Make sure MongoDB is running!"
echo "  macOS:   brew services start mongodb-community"
echo "  Linux:   sudo systemctl start mongod"
echo "  Windows: net start MongoDB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
