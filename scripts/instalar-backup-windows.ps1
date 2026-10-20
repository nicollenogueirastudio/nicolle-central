# Cria (ou atualiza) a tarefa agendada do Windows que roda o backup todo dia ao meio-dia.
# Se o computador estiver desligado nesse horário, roda assim que ligar.

$script = Join-Path $PSScriptRoot 'backup-windows.ps1'
$acao = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$script`""
$quando = New-ScheduledTaskTrigger -Daily -At 12:00
$opcoes = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 15)
Register-ScheduledTask -TaskName 'Nicolle Central - Backup' -Description 'Backup diário do banco da Nicolle Central para o Google Drive' `
  -Action $acao -Trigger $quando -Settings $opcoes -Force | Out-Null
Write-Output 'Tarefa "Nicolle Central - Backup" criada: todo dia às 12h.'
