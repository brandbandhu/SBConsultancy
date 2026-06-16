@echo off
cd /d "%~dp0"
echo Starting SB Consultants Admin Dashboard...
echo.
echo Frontend: http://localhost:8080/admin
echo Backend:  http://localhost:5000/api/admin
echo.
npm run dev:admin
pause
