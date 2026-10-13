@echo off
setlocal
cd /d D:\Apps\Wifi-System\wifi-system-videos\remotion
set CHROME_CRASHPAD_PIPE_NAME=

call npx remotion render Video1-WatchThisFirst out\video1-watch-this-first.mp4
if errorlevel 1 exit /b 1
call npx remotion render Video2-HowTheMoneyFlows out\video2-how-the-money-flows.mp4
if errorlevel 1 exit /b 1
call npx remotion render Video4-GoldRushMindset out\video4-gold-rush-mindset.mp4
if errorlevel 1 exit /b 1
call npx remotion render Video6-MyVaultMindset out\video6-my-vault-mindset.mp4
if errorlevel 1 exit /b 1
call npx remotion render Video8-LinkVaultMindset out\video8-link-vault-mindset.mp4
if errorlevel 1 exit /b 1
call npx remotion render Video10-UnlimitedMindset out\video10-unlimited-mindset.mp4
if errorlevel 1 exit /b 1
call npx remotion render Video22-DoneForYouProfitMindset out\video22-done-for-you-profit-mindset.mp4
if errorlevel 1 exit /b 1

cd ..
if not exist "D:\Apps\Wifi-System\training-video-system\wifi-system\videos" mkdir "D:\Apps\Wifi-System\training-video-system\wifi-system\videos"
copy /Y remotion\out\*.mp4 "D:\Apps\Wifi-System\training-video-system\wifi-system\videos\" >nul
echo Done.
endlocal
