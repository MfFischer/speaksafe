@echo off
echo 🚀 Deploying SpeakSafe to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Navigate to frontend directory
cd frontend

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the application
echo 🔨 Building application...
npm run build

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo.
echo 🎯 Your SpeakSafe application is now live!
echo 📋 Next steps for grant applications:
echo    1. Update README.md with your live demo URL
echo    2. Test all features on the deployed version
echo    3. Share the GitHub repository with grant organizations
echo    4. Highlight the professional UI and complete user journey
echo.
echo 🔗 Repository: https://github.com/MfFischer/speaksafe
echo 📧 Ready for grant applications and portfolio showcase!

pause
