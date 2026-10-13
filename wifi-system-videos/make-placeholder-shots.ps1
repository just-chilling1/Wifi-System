$names = @("dashboard","create","pages","share","training","support","bonus-training","dfy-profit")
$out = "D:\Apps\Wifi-System\wifi-system-videos\screenshots"
$shots = "D:\Apps\Wifi-System\wifi-system-videos\remotion\public\shots"
New-Item -ItemType Directory -Force -Path $out, $shots | Out-Null
Add-Type -AssemblyName System.Drawing
foreach ($n in $names) {
  $bmp = New-Object System.Drawing.Bitmap 1920, 1080
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::FromArgb(255, 22, 18, 20))
  $font = New-Object System.Drawing.Font("Arial", 48, [System.Drawing.FontStyle]::Bold)
  $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 247, 244, 244))
  $g.DrawString("Wifi System - $n", $font, $brush, 120, 480)
  $path = Join-Path $out "$n.png"
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  Copy-Item $path (Join-Path $shots "$n.png") -Force
  $g.Dispose(); $bmp.Dispose()
}
Write-Host "Placeholder screenshots written."
