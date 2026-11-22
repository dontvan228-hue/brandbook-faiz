# Renders the icon pages (render_icons.py) to 256px PNGs with headless Chrome and packs them into .ico.
# Usage: powershell -File build-icons.ps1 -Out <build dir>
param([Parameter(Mandatory)][string]$Out)
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
python -P "$PSScriptRoot\render_icons.py" pages $Out
foreach ($f in Get-ChildItem $Out -Recurse -Filter *.html) {
  $png = [IO.Path]::ChangeExtension($f.FullName, '.png')
  $uri = 'file:///' + ($f.FullName -replace '\\','/')
  cmd /c "`"$chrome`" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=5000 --default-background-color=00000000 --window-size=256,256 `"--screenshot=$png`" `"$uri`" 2>nul" | Out-Null
  if (-not (Test-Path $png)) { throw "render failed: $($f.FullName)" }
}
python -P "$PSScriptRoot\render_icons.py" ico $Out
Get-ChildItem $Out -Recurse -Filter *.ico | Measure-Object | ForEach-Object { "ico files: $($_.Count)" }
