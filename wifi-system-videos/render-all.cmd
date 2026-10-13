@echo off
setlocal
cd /d D:\Apps\Wifi-System\wifi-system-videos

echo === Copy voiceovers into Remotion public ===
for %%n in (1 2 4 6 8 10 22) do copy /Y vo%%n.mp3 remotion\public\vo%%n.mp3 >nul

if not exist screenshots\dashboard.png (
  echo === No screenshots yet — writing placeholders. For real UI shots: npm run dev in Wifi-System, then node capture.js ===
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0make-placeholder-shots.ps1"
)

if exist screenshots\dashboard.png (
  for %%f in (dashboard create pages share training support bonus-training dfy-profit) do (
    if exist screenshots\%%f.png copy /Y screenshots\%%f.png remotion\public\shots\%%f.png >nul
  )
)

echo === Transcribe (CPU, slow) ===
python transcribe_fw.py vo1.mp3 vo2.mp3 vo4.mp3 vo6.mp3 vo8.mp3 vo10.mp3 vo22.mp3
if errorlevel 1 exit /b 1

echo === Align slides ===
python align.py
if errorlevel 1 (
  echo align.py reported anchor misses — fix align.py or check transcripts, then re-run from align.
  exit /b 1
)

cd remotion
if not exist node_modules (
  echo === npm install Remotion ===
  call npm install
  if errorlevel 1 exit /b 1
)

set CHROME_CRASHPAD_PIPE_NAME=
echo === Render dashboard videos (CPU) ===
call npx remotion render Video1-WatchThisFirst out\video1-watch-this-first.mp4
if errorlevel 1 exit /b 1
call npx remotion render Video2-HowTheMoneyFlows out\video2-how-the-money-flows.mp4
if errorlevel 1 exit /b 1

echo === Render mindset videos (CPU) ===
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

echo.
echo Done. MP4s in training-video-system\wifi-system\videos\
endlocal
