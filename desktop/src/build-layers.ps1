# Renders every wallpaper layer page (from render_layers.py) to PNG with headless Chrome.
# Usage: powershell -File build-layers.ps1 -Out <build dir>
param([Parameter(Mandatory)][string]$Out)
$ErrorActionPreference = 'Stop'
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
python -P "$PSScriptRoot\render_layers.py" $Out
foreach ($brand in 'vape','bakery') {
  $d = Join-Path $Out $brand
  foreach ($f in Get-ChildItem $d -Filter *.html) {
    $png = [IO.Path]::ChangeExtension($f.FullName, '.png')
    $size = if ($f.BaseName -in 'bg','wallpaper') { '1920,1080' } else { '1200,1200' }
    $bgArg = if ($f.BaseName -in 'bg','wallpaper') { @() } else { @('--default-background-color=00000000') }
    $uri = 'file:///' + ($f.FullName -replace '\\','/')
    # Chrome logs harmless notices to stderr; run it through cmd so they do not count as errors
    cmd /c "`"$chrome`" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=6000 $($bgArg -join ' ') --window-size=$size `"--screenshot=$png`" `"$uri`" 2>nul" | Out-Null
    if (-not (Test-Path $png)) { throw "render failed: $($f.Name)" }
  }
}
Get-ChildItem $Out -Recurse -Filter *.png | Select-Object @{n='file';e={$_.FullName.Substring($Out.Length+1)}}, Length
