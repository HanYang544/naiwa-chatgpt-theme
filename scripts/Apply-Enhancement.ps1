param([switch]$Restore)
$ErrorActionPreference='Stop'
$node=(Get-Command node -ErrorAction Stop).Source
$session=Get-CimInstance Win32_Process -Filter "Name='ChatGPT.exe'" | Where-Object { $_.ExecutablePath -like '*\WindowsApps\OpenAI.Codex_*\app\ChatGPT.exe' -and $_.CommandLine -match '--remote-debugging-address=127.0.0.1' -and $_.CommandLine -match '--remote-debugging-port=(\d+)' } | Select-Object -First 1
if (-not $session) { throw 'No local theme session. Launch the official app through OpenChatGPTSkin first.' }
if ($session.CommandLine -notmatch '--remote-debugging-port=(\d+)') { throw 'Missing local port' }
$port=[int]$Matches[1]
$listener=Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction Stop
if (-not ($listener | Where-Object { $_.LocalAddress -eq '127.0.0.1' -and $_.OwningProcess -eq $session.ProcessId })) { throw 'Local debug port ownership mismatch' }
$extra=@()
if ($Restore) { $extra=@('--restore') }
& $node (Join-Path $PSScriptRoot 'apply-enhancement.mjs') $port @extra
if ($LASTEXITCODE -ne 0) { throw 'Enhancement operation failed' }
