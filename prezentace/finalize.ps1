# Otevře prezentaci v PowerPointu: autoplay videa, vložení fontů, export náhledů
param([string]$Src = "$PSScriptRoot\FERSIT_prezentace.pptx", [string]$PngDir = "$PSScriptRoot\nahled")
$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force $PngDir | Out-Null
Get-ChildItem $PngDir -Filter *.png | Remove-Item -Force
$pp = New-Object -ComObject PowerPoint.Application
try {
  $pres = $pp.Presentations.Open($Src, 0, 0, 0)
  $s2 = $pres.Slides.Item(2)
  foreach ($sh in $s2.Shapes) {
    if ($sh.Type -eq 16) {
      $sh.AnimationSettings.PlaySettings.PlayOnEntry = -1
      $sh.AnimationSettings.PlaySettings.HideWhileNotPlaying = 0
      "video: autoplay ON"
    }
  }
  $null = $pres.Slides.Item(1).Export("$PngDir\_warm.png", 'PNG', 320, 180); Remove-Item "$PngDir\_warm.png"
  foreach ($sl in $pres.Slides) { $sl.Export("$PngDir\_warm.png", 'PNG', 320, 180) }; Remove-Item "$PngDir\_warm.png"
  $i = 0
  foreach ($sl in $pres.Slides) { $i++; $sl.Export("$PngDir\slide-$('{0:D2}' -f $i).png", 'PNG', 1600, 900) }
  "exported $i slides"
  $tmp = "$PSScriptRoot\_tmp_save.pptx"
  $pres.SaveAs($tmp, 24, -1)   # 24 = pptx, -1 = vložit TrueType fonty
  $pres.Close()
  Move-Item -Force $tmp $Src
  "saved with embedded fonts"
} finally { $pp.Quit() | Out-Null; [System.Runtime.Interopservices.Marshal]::ReleaseComObject($pp) | Out-Null }
