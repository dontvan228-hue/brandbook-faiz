# Builds the USB kits: desktop\dist\<Brand folder>\ (Установить.cmd, Вернуть как было.cmd, Прочитай меня.txt, files\...)
# and a zip per brand. Usage: powershell -File build-kit.ps1 -Layers <layers build dir> -Icons <icons build dir> -Exe <FaizWall.exe>
param([Parameter(Mandatory)][string]$Layers, [Parameter(Mandatory)][string]$Icons, [Parameter(Mandatory)][string]$Exe)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$dist = Join-Path $root 'dist'
$utf8bom = New-Object System.Text.UTF8Encoding($true)
$names = @{ vape = 'ФАЙЗ — вейп-шоп'; bakery = 'ФАЙЗ — пекарня' }
$zips  = @{ vape = 'FAIZ-desktop-vape.zip'; bakery = 'FAIZ-desktop-bakery.zip' }
if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
foreach ($b in 'vape','bakery') {
  $kit = Join-Path $dist $names[$b]; $files = Join-Path $kit 'files'; $ico = Join-Path $files 'icons'
  New-Item -ItemType Directory -Force $ico | Out-Null
  Copy-Item $Exe $files
  foreach ($n in 'bg','ring_outer','ring_main','ring_inner','core','wallpaper') { Copy-Item (Join-Path $Layers "$b\$n.png") $files }
  Copy-Item (Join-Path $Icons "$b\*.ico") $ico
  [IO.File]::WriteAllText((Join-Path $files 'brand.txt'), $b)
  [IO.File]::WriteAllText((Join-Path $files 'setup.ps1'), [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'setup.ps1')), $utf8bom)
  # .cmd files stay ASCII: cmd reads them before any code page switch; the Russian text comes from setup.ps1
  $run = { param($mode) "@echo off`r`nchcp 65001 >nul`r`npowershell -NoProfile -ExecutionPolicy Bypass -File `"%~dp0files\setup.ps1`" -Mode $mode -Brand $b`r`necho.`r`npause`r`n" }
  [IO.File]::WriteAllText((Join-Path $kit 'Установить.cmd'), (& $run 'install'))
  [IO.File]::WriteAllText((Join-Path $kit 'Вернуть как было.cmd'), (& $run 'uninstall'))
  $readme = @"
$($names[$b]) — оформление рабочего стола

Что делает «Установить»:
  • живые обои: «Ф» в центре, вокруг медленно вращаются кольца паттерна;
  • неподвижные фирменные обои под ними (если живые не запустятся, стол всё равно в стиле ФАЙЗ);
  • фирменные значки: «Этот компьютер», «Корзина», все папки на рабочем столе,
    ярлыки Saby (Бизнес / Ретейл — по названию ярлыка), файлы Excel, Word, CSV и PDF;
  • живые обои запускаются сами при включении компьютера.
Всё ставится только для текущего пользователя Windows, права администратора не нужны.

Как поставить:
  1. Скопируйте эту папку на флешку, вставьте флешку в компьютер точки.
  2. Дважды щёлкните «Установить». Если Windows спросит про неизвестного издателя —
     «Подробнее» → «Выполнить в любом случае».
  3. Согласитесь на перезагрузку.

Как вернуть как было: дважды щёлкните «Вернуть как было» — вернутся прежние обои и значки.

Значки Excel, Word и PDF меняются для всех таких файлов на этом компьютере (так устроена Windows).
Если живые обои не появились — посмотрите файл %LOCALAPPDATA%\FAIZ\wall.log:
  там написано, удалось ли встроиться под значки рабочего стола. Мешать могут другие программы
  живых обоев (Wallpaper Engine, Lively) — с ними одновременно не работает.
"@
  [IO.File]::WriteAllText((Join-Path $kit 'Прочитай меня.txt'), $readme, $utf8bom)
  $zip = Join-Path $dist $zips[$b]
  Compress-Archive -Path $kit -DestinationPath $zip -Force
}
Get-ChildItem $dist -Recurse -File | Select-Object @{n='file';e={$_.FullName.Substring($dist.Length+1)}}, Length | Format-Table -AutoSize
