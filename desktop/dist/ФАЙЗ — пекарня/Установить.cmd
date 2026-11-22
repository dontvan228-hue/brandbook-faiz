@echo off
chcp 65001 >nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0files\setup.ps1" -Mode install -Brand bakery
echo.
pause
