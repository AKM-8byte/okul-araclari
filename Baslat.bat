@echo off
chcp 65001 >nul
title Okul Araclari
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0sunucu.ps1"
