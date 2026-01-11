@echo off
echo 🎹 VR界面交互技术 - 星空钢琴3D版 部署脚本
echo.
echo 正在启动本地服务器...
echo.
echo 请选择启动方式:
echo 1. Python HTTP Server (推荐)
echo 2. 直接打开浏览器
echo.
set /p choice=请输入选择 (1 或 2): 

if "%choice%"=="1" (
    echo.
    echo 启动Python HTTP Server...
    echo 服务器地址: http://localhost:8000
    echo 按 Ctrl+C 停止服务器
    echo.
    python -m http.server 8000
) else if "%choice%"=="2" (
    echo.
    echo 直接打开浏览器...
    start index.html
) else (
    echo 无效选择，直接打开浏览器...
    start index.html
)

pause