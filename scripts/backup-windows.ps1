# Backup diário do banco da Nicolle Central para o Google Drive.
# Roda pela tarefa agendada "Nicolle Central - Backup" (instalar-backup-windows.ps1).
# Baixa cada tabela de /api/cron/backup (protegido pelo CRON_SECRET do .env.local),
# junta num .zip por dia e guarda os últimos 60 dias.

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Projeto = Split-Path -Parent $PSScriptRoot
$Destino = 'I:\Meu Drive\02 - CLAUDE\Backups Nicolle Central'
$Endereco = 'https://nicolle-central.vercel.app/api/cron/backup'
$Manter = 60
$Hoje = Get-Date -Format 'yyyy-MM-dd'
$Log = Join-Path $Destino 'backup.log'

function Anotar($texto) {
  $linha = "$(Get-Date -Format 'yyyy-MM-dd HH:mm')  $texto"
  Add-Content -Path $Log -Value $linha -Encoding UTF8
}

try {
  if (-not (Test-Path $Destino)) { New-Item -ItemType Directory -Path $Destino | Out-Null }

  $segredo = (Get-Content (Join-Path $Projeto '.env.local') -Encoding UTF8 | Where-Object { $_ -match '^CRON_SECRET=' }) -replace '^CRON_SECRET=', ''
  if (-not $segredo) { throw 'CRON_SECRET não encontrado no .env.local' }
  $cabecalho = @{ Authorization = "Bearer $($segredo.Trim())" }

  $pasta = Join-Path $env:TEMP "nicolle-central-backup-$Hoje"
  if (Test-Path $pasta) { Remove-Item $pasta -Recurse -Force }
  New-Item -ItemType Directory -Path $pasta | Out-Null

  # A lista de tabelas e o total de linhas de cada uma.
  $indice = Join-Path $pasta '_tabelas.json'
  Invoke-WebRequest -Uri $Endereco -Headers $cabecalho -OutFile $indice -UseBasicParsing
  $info = Get-Content $indice -Raw -Encoding UTF8 | ConvertFrom-Json
  $lote = [int]$info.lote
  $linhas = 0

  foreach ($t in $info.tabelas.PSObject.Properties) {
    $total = if ($t.Value -eq $null) { 0 } else { [int]$t.Value }
    $partes = [Math]::Max(1, [Math]::Ceiling($total / $lote))
    for ($p = 0; $p -lt $partes; $p++) {
      $arquivo = Join-Path $pasta ("{0}-{1}.json" -f $t.Name, $p)
      Invoke-WebRequest -Uri "$($Endereco)?tabela=$($t.Name)&de=$($p * $lote)" -Headers $cabecalho -OutFile $arquivo -UseBasicParsing
    }
    $linhas += $total
  }

  $zip = Join-Path $Destino "banco-$Hoje.zip"
  if (Test-Path $zip) { Remove-Item $zip -Force }
  Compress-Archive -Path (Join-Path $pasta '*') -DestinationPath $zip
  Remove-Item $pasta -Recurse -Force

  # Guarda só os últimos $Manter backups.
  Get-ChildItem $Destino -Filter 'banco-*.zip' | Sort-Object Name -Descending | Select-Object -Skip $Manter | Remove-Item -Force

  $kb = [Math]::Round((Get-Item $zip).Length / 1KB)
  Anotar "ok · $($info.tabelas.PSObject.Properties.Count) tabelas · $linhas linhas · $kb KB"
} catch {
  Anotar "ERRO · $($_.Exception.Message)"
  exit 1
}
