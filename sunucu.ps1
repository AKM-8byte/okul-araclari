# Okul Araçları — taşınabilir yerel sunucu (kurulum gerektirmez, yalnızca Windows PowerShell)
# Kullanım: Baslat.bat dosyasına çift tıklayın.
param([int]$Port = 8765, [switch]$NoBrowser)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$url  = "http://127.0.0.1:$Port/"
$mime = @{
  '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'
  '.json'='application/json; charset=utf-8'; '.webmanifest'='application/manifest+json; charset=utf-8'
  '.png'='image/png'; '.jpg'='image/jpeg'; '.svg'='image/svg+xml'; '.woff2'='font/woff2'; '.ico'='image/x-icon'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
try { $listener.Start() }
catch {
  # Port doluysa Okul Araçları zaten açıktır: sadece pencereyi aç.
  Write-Host "Sunucu zaten çalışıyor olabilir, açılıyor: $url"
  if (-not $NoBrowser) { Start-Process $url }
  exit
}

$proc = $null
if (-not $NoBrowser) {
  # Edge/Chrome varsa uygulama penceresi + verileri bu klasördeki "veri" dizininde sakla (taşınabilir).
  $cands = @(
    "$env:ProgramFiles (x86)\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
  )
  $browser = $cands | Where-Object { Test-Path $_ } | Select-Object -First 1
  if ($browser) {
    $data = Join-Path $root 'veri'
    $proc = Start-Process $browser -ArgumentList "--app=$url", "--user-data-dir=`"$data`"", '--no-first-run', '--no-default-browser-check' -PassThru
  } else {
    Start-Process $url
    Write-Host 'Okul Araçları çalışıyor. Kapatmak için bu pencereyi kapatın.'
  }
}

try {
  while ($listener.IsListening) {
    $task = $listener.GetContextAsync()
    while (-not $task.Wait(1000)) {
      if ($proc -and $proc.HasExited) { $listener.Stop(); exit }   # pencere kapandı -> sunucuyu kapat
    }
    $ctx = $task.Result
    try {
      $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
      if ($rel -eq '') { $rel = 'index.html' }
      $path = [IO.Path]::GetFullPath((Join-Path $root $rel))
      $inRoot = $path.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -and ($path.Substring($root.Length).TrimStart('\') -notmatch '^(veri|\.git|\.claude|\.superpowers)([\x5c/]|$)')
      if ($inRoot -and (Test-Path $path -PathType Leaf)) {
        $bytes = [IO.File]::ReadAllBytes($path)
        $ext = [IO.Path]::GetExtension($path).ToLower()
        $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      } else { $ctx.Response.StatusCode = 404 }
    } catch { $ctx.Response.StatusCode = 500 }
    finally { $ctx.Response.Close() }
  }
} finally { $listener.Close() }
