#!/bin/bash

# Quick Test Script for Vendor Interview Flow
# Run this to test the complete flow locally

echo "🧪 VENDOR INTERVIEW SLOT SELECTION - QUICK TEST"
echo "================================================"
echo ""

# Test 1: Check if backend is running
echo "1️⃣ Testing backend connection..."
curl -s http://localhost:5000/api/vendors > /dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Backend is running"
else
    echo "   ❌ Backend not running. Start with: npm run dev"
    exit 1
fi

# Test 2: Check if frontend is running
echo ""
echo "2️⃣ Testing frontend connection..."
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Frontend is running"
else
    echo "   ❌ Frontend not running. Start with: npm start"
    exit 1
fi

# Test 3: Get a test interview code
echo ""
echo "3️⃣ Creating test interview code..."
TEST_CODE="ASTROVAANI-TEST123"
echo "   📝 Test code: $TEST_CODE"

# Test 4: Open the interview page
echo ""
echo "4️⃣ Opening vendor interview page..."
echo "   🌐 URL: http://localhost:3000/interview?code=$TEST_CODE"
echo ""

# Detect OS and open browser
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:3000/interview?code=$TEST_CODE" 2>/dev/null
elif [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:3000/interview?code=$TEST_CODE"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    start "http://localhost:3000/interview?code=$TEST_CODE"
fi

echo "✅ Test page opened in browser!"
echo ""
echo "📋 Manual Steps:"
echo "   1. Login to admin panel: http://localhost:3000/admin"
echo "   2. Edit a vendor and add interview slots"
echo "   3. Click 'Notify Vendor' button"
echo "   4. Copy the interview code from console logs"
echo "   5. Open: http://localhost:3000/interview?code=YOUR_CODE"
echo "   6. Select a slot and confirm"
echo ""
echo "🎉 Complete!"
