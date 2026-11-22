# ФАЙЗ — оформление рабочего стола: установка и возврат как было.
# Всё ставится только для текущего пользователя, права администратора не нужны.
#   -Mode install    поставить обои, живые обои, значки и автозапуск
#   -Mode uninstall  вернуть всё как было (из сохранённой копии настроек)
#   -Mode check      ничего не менять, только показать, что будет сделано
param([ValidateSet('install','uninstall','check')][string]$Mode = 'check', [string]$Brand = 'vape')

$ErrorActionPreference = 'Continue'
$src  = $PSScriptRoot
$dst  = Join-Path $env:LOCALAPPDATA 'FAIZ'
$bak  = Join-Path $dst 'backup.json'
$desk = [Environment]::GetFolderPath('Desktop')
$dry  = $Mode -eq 'check'
$CLSID_PC  = '{20D04FE0-3AEA-1069-A2D8-08002B30309D}'
$CLSID_BIN = '{645FF040-5081-101B-9F08-00AA002F954E}'
$clsKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\CLSID'
$runKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
$DOC = [ordered]@{ '.xlsx'='doc_xls'; '.xls'='doc_xls'; '.csv'='doc_xls'; '.docx'='doc_doc'; '.doc'='doc_doc'; '.pdf'='doc_pdf' }

function Say($t) { Write-Host "  $t" }
function Act($t, [scriptblock]$do) { if ($dry) { Say "[будет] $t" } else { Say $t; & $do } }

Add-Type @"
using System; using System.Runtime.InteropServices;
public static class FaizNative {
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern bool SystemParametersInfo(int a, int b, string c, int d);
  [DllImport("shell32.dll")] public static extern void SHChangeNotify(int e, int f, IntPtr a, IntPtr b);
}
"@
function Set-Wall($path) { [void][FaizNative]::SystemParametersInfo(20, 0, $path, 3) }
function RegGet($key, $name) { try { (Get-ItemProperty -Path $key -Name $name -ErrorAction Stop).$name } catch { $null } }
function RegSet($key, $name, $val) { if (-not (Test-Path $key)) { New-Item -Path $key -Force | Out-Null }; Set-ItemProperty -Path $key -Name $name -Value $val }
function ProgId($ext) {
  $u = RegGet "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\$ext\UserChoice" 'ProgId'
  if ($u) { return $u }
  try { return (Get-Item "Registry::HKEY_CLASSES_ROOT\$ext" -ErrorAction Stop).GetValue('') } catch { return $null }
}
$shell = New-Object -ComObject WScript.Shell
function SabyLinks { Get-ChildItem $desk -Filter *.lnk -ErrorAction SilentlyContinue | Where-Object { $_.BaseName -match 'saby|сбис|sbis' } }
function SabyIcon($name) { if ($name -match 'ретейл|ритейл|retail|касс|presto|престо') { 'saby_retail' } else { 'saby_business' } }

Write-Host ""
Write-Host "ФАЙЗ — оформление рабочего стола ($Brand): $Mode"
Write-Host ""

if ($Mode -in 'install','check') {
  # 1. files
  Act "Копирую файлы в $dst" {
    New-Item -ItemType Directory -Force $dst | Out-Null
    Get-Process FaizWall -ErrorAction SilentlyContinue | Stop-Process -Force
    Copy-Item (Join-Path $src '*') $dst -Recurse -Force
    # files that came through a messenger or browser carry a "from the internet" mark; drop it on our own files
    Get-ChildItem $dst -Recurse -File | Unblock-File -ErrorAction SilentlyContinue
  }
  $ico = Join-Path $dst 'icons'

  # 2. remember how it was (only the first time, so a second brand does not overwrite the original)
  if (-not (Test-Path $bak)) {
    $b = [ordered]@{
      wallpaper = RegGet 'HKCU:\Control Panel\Desktop' 'Wallpaper'
      style     = RegGet 'HKCU:\Control Panel\Desktop' 'WallpaperStyle'
      tile      = RegGet 'HKCU:\Control Panel\Desktop' 'TileWallpaper'
      pc        = RegGet "$clsKey\$CLSID_PC\DefaultIcon" '(default)'
      binDef    = RegGet "$clsKey\$CLSID_BIN\DefaultIcon" '(default)'
      binEmpty  = RegGet "$clsKey\$CLSID_BIN\DefaultIcon" 'empty'
      binFull   = RegGet "$clsKey\$CLSID_BIN\DefaultIcon" 'full'
      types     = @{}; folders = @{}; links = @{}
    }
    foreach ($ext in $DOC.Keys) { $p = ProgId $ext; if ($p -and -not $b.types.ContainsKey($p)) { $b.types[$p] = RegGet "HKCU:\Software\Classes\$p\DefaultIcon" '(default)' } }
    foreach ($f in Get-ChildItem $desk -Directory -ErrorAction SilentlyContinue) { $ini = Join-Path $f.FullName 'desktop.ini'; $b.folders[$f.FullName] = if (Test-Path $ini) { Get-Content $ini -Raw } else { $null } }
    foreach ($l in SabyLinks) { $b.links[$l.FullName] = $shell.CreateShortcut($l.FullName).IconLocation }
    Act "Запоминаю прежние обои и значки ($bak)" { $b | ConvertTo-Json -Depth 4 | Set-Content -Path $bak -Encoding UTF8 }
  } else { Say "Прежние настройки уже сохранены раньше — оставляю их как есть" }

  # 3. wallpaper (still) + live wallpaper autostart
  Act "Обои: $dst\wallpaper.png (растянуть по экрану)" {
    RegSet 'HKCU:\Control Panel\Desktop' 'WallpaperStyle' '10'; RegSet 'HKCU:\Control Panel\Desktop' 'TileWallpaper' '0'
    Set-Wall (Join-Path $dst 'wallpaper.png')
  }
  Act "Живые обои: автозапуск FaizWall.exe при входе в Windows" { RegSet $runKey 'FAIZ Wallpaper' ('"' + (Join-Path $dst 'FaizWall.exe') + '"') }

  # 4. icons: this PC, recycle bin
  Act "Значок «Этот компьютер»" { RegSet "$clsKey\$CLSID_PC\DefaultIcon" '(default)' "$ico\computer.ico,0" }
  Act "Значки «Корзина» (пустая и полная)" {
    RegSet "$clsKey\$CLSID_BIN\DefaultIcon" '(default)' "$ico\bin_empty.ico,0"
    RegSet "$clsKey\$CLSID_BIN\DefaultIcon" 'empty' "$ico\bin_empty.ico,0"
    RegSet "$clsKey\$CLSID_BIN\DefaultIcon" 'full'  "$ico\bin_full.ico,0"
  }
  # 5. folders on the desktop
  foreach ($f in Get-ChildItem $desk -Directory -ErrorAction SilentlyContinue) {
    Act "Значок папки «$($f.Name)»" {
      $ini = Join-Path $f.FullName 'desktop.ini'
      if (Test-Path $ini) { attrib -s -h -r $ini | Out-Null }
      "[.ShellClassInfo]`r`nIconResource=$ico\folder.ico,0`r`n" | Set-Content -Path $ini -Encoding Unicode
      attrib +s +h $ini | Out-Null; attrib +r $f.FullName | Out-Null
    }
  }
  # 6. Saby shortcuts
  $links = @(SabyLinks)
  if (-not $links) { Say "Ярлыков Saby на рабочем столе не нашёл — пропускаю" }
  foreach ($l in $links) {
    $which = SabyIcon $l.BaseName
    Act "Значок ярлыка «$($l.BaseName)» ($which)" { $s = $shell.CreateShortcut($l.FullName); $s.IconLocation = "$ico\$which.ico,0"; $s.Save() }
  }
  # 7. report files (Excel, Word, PDF) — per file type, for this user
  foreach ($ext in $DOC.Keys) {
    $p = ProgId $ext
    if (-not $p) { Say "Тип $ext не зарегистрирован — пропускаю"; continue }
    Act "Значок файлов $ext ($p)" { RegSet "HKCU:\Software\Classes\$p\DefaultIcon" '(default)' "$ico\$($DOC[$ext]).ico,0" }
  }
  if (-not $dry) {
    ie4uinit.exe -show 2>$null
    [FaizNative]::SHChangeNotify(0x08000000, 0, [IntPtr]::Zero, [IntPtr]::Zero)
    Start-Process (Join-Path $dst 'FaizWall.exe')
    Write-Host ""
    Write-Host "Готово. Чтобы всё точно применилось, лучше перезагрузить компьютер."
    $a = Read-Host "Перезагрузить сейчас? (д/н)"
    if ($a -match '^(д|да|y|yes)$') { Restart-Computer -Force }
  }
}

if ($Mode -eq 'uninstall') {
  if (-not (Test-Path $bak)) { Say "Сохранённых настроек нет — возвращать нечего"; exit 0 }
  $b = Get-Content $bak -Raw | ConvertFrom-Json
  Get-Process FaizWall -ErrorAction SilentlyContinue | Stop-Process -Force
  Remove-ItemProperty -Path $runKey -Name 'FAIZ Wallpaper' -ErrorAction SilentlyContinue
  Say "Живые обои убраны из автозапуска"
  if ($b.style) { RegSet 'HKCU:\Control Panel\Desktop' 'WallpaperStyle' $b.style }
  if ($null -ne $b.tile) { RegSet 'HKCU:\Control Panel\Desktop' 'TileWallpaper' $b.tile }
  Set-Wall ([string]$b.wallpaper); Say "Обои возвращены"
  foreach ($pair in @(@($CLSID_PC,'(default)',$b.pc), @($CLSID_BIN,'(default)',$b.binDef), @($CLSID_BIN,'empty',$b.binEmpty), @($CLSID_BIN,'full',$b.binFull))) {
    $k = "$clsKey\$($pair[0])\DefaultIcon"
    if ($null -eq $pair[2]) { Remove-ItemProperty -Path $k -Name $pair[1] -ErrorAction SilentlyContinue } else { RegSet $k $pair[1] $pair[2] }
  }
  Say "Значки «Этот компьютер» и «Корзина» возвращены"
  foreach ($p in $b.types.PSObject.Properties) {
    $k = "HKCU:\Software\Classes\$($p.Name)\DefaultIcon"
    if ($null -eq $p.Value) { Remove-ItemProperty -Path $k -Name '(default)' -ErrorAction SilentlyContinue } else { RegSet $k '(default)' $p.Value }
  }
  Say "Значки файлов Excel, Word, PDF возвращены"
  foreach ($p in $b.folders.PSObject.Properties) {
    $ini = Join-Path $p.Name 'desktop.ini'
    if (-not (Test-Path $p.Name)) { continue }
    if (Test-Path $ini) { attrib -s -h -r $ini | Out-Null; Remove-Item $ini -Force }
    if ($null -ne $p.Value) { $p.Value | Set-Content -Path $ini -Encoding Unicode -NoNewline; attrib +s +h $ini | Out-Null } else { attrib -r $p.Name | Out-Null }
  }
  # folders created after installation got our desktop.ini too: drop those that point to FAIZ
  foreach ($f in Get-ChildItem $desk -Directory -ErrorAction SilentlyContinue) {
    $ini = Join-Path $f.FullName 'desktop.ini'
    if ((Test-Path $ini) -and ((Get-Content $ini -Raw) -match [regex]::Escape($dst))) { attrib -s -h -r $ini | Out-Null; Remove-Item $ini -Force; attrib -r $f.FullName | Out-Null }
  }
  Say "Значки папок возвращены"
  foreach ($p in $b.links.PSObject.Properties) { if (Test-Path $p.Name) { $s = $shell.CreateShortcut($p.Name); $s.IconLocation = $p.Value; $s.Save() } }
  Say "Значки ярлыков Saby возвращены"
  ie4uinit.exe -show 2>$null
  [FaizNative]::SHChangeNotify(0x08000000, 0, [IntPtr]::Zero, [IntPtr]::Zero)
  Remove-Item $dst -Recurse -Force -ErrorAction SilentlyContinue
  Say "Файлы ФАЙЗ удалены"
}
Write-Host ""
