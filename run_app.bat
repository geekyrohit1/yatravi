@echo off
echo Starting Yatravi Backend...
start "Yatravi Backend" cmd /k "npm run server"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Yatravi Frontend...
start "Yatravi Frontend" cmd /k "npm run dev"

echo Both servers are starting in separate windows!
echo You can close this window now.
