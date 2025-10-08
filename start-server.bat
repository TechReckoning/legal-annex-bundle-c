@echo off
echo Starting Caselib Bundle Development Server...
echo.
echo Make sure to keep this window open while using the application.
echo The server will be available at: http://localhost:5000/
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.

REM Add Node.js to PATH
set PATH=%PATH%;C:\Program Files\nodejs

REM Start the development server
npm run dev

pause
