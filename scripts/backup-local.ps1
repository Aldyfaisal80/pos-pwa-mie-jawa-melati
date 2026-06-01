# ============================================================
# backup-local.ps1 — Local Database Backup Script
# POS PWA - Mie Jawa Melati
#
# USAGE:
#   .\scripts\backup-local.ps1
# ============================================================

$ErrorActionPreference = "Stop"

# --- Config ---
$HOST_DB  = "aws-1-ap-southeast-1.pooler.supabase.com"
$PORT_DB  = "5432"
$USER_DB  = "postgres.hrzvdledrengvxuzmsbk"
$DBNAME   = "postgres"
$OUTDIR   = "backup"
$TIMESTAMP = (Get-Date -Format "yyyy-MM-dd_HH-mm")

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   POS PWA — Local Database Backup"     -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- Check pg_dump ---
if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] pg_dump tidak ditemukan." -ForegroundColor Red
    Write-Host ""
    Write-Host "Install PostgreSQL client terlebih dahulu:"
    Write-Host "  winget install PostgreSQL.PostgreSQL"
    Write-Host "  atau download dari: https://www.postgresql.org/download/windows/"
    exit 1
}

$pgVersion = (pg_dump --version)
Write-Host "[OK] $pgVersion" -ForegroundColor Green

# --- Ask password ---
Write-Host ""
$securePass = Read-Host "Masukkan password database Supabase" -AsSecureString
$PASS = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass)
)
$env:PGPASSWORD = $PASS

Write-Host ""
Write-Host "[INFO] Memulai backup ke folder: $OUTDIR/" -ForegroundColor Yellow

# --- Create output dir ---
New-Item -ItemType Directory -Force -Path $OUTDIR | Out-Null

# --- Dump Schema ---
Write-Host ""
Write-Host "[1/2] Dump schema (DDL)..." -ForegroundColor Cyan
try {
    & pg_dump `
        --host=$HOST_DB `
        --port=$PORT_DB `
        --username=$USER_DB `
        --dbname=$DBNAME `
        --schema-only `
        --no-owner `
        --no-privileges `
        --quote-all-identifiers `
        --schema=public `
        -f "$OUTDIR/schema.sql"
    Write-Host "      -> $OUTDIR/schema.sql [OK]" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Gagal dump schema: $_" -ForegroundColor Red
    exit 1
}

# --- Dump Data ---
Write-Host ""
Write-Host "[2/2] Dump data (DML — rows)..." -ForegroundColor Cyan
try {
    & pg_dump `
        --host=$HOST_DB `
        --port=$PORT_DB `
        --username=$USER_DB `
        --dbname=$DBNAME `
        --data-only `
        --no-owner `
        --no-privileges `
        --quote-all-identifiers `
        --schema=public `
        -f "$OUTDIR/data.sql"
    Write-Host "      -> $OUTDIR/data.sql [OK]" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Gagal dump data: $_" -ForegroundColor Red
    exit 1
}

# --- Clear password ---
Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue

# --- Write Manifest ---
$manifestContent = @"
# Backup Manifest (Local)

| Field | Value |
|-------|-------|
| **Timestamp** | $(Get-Date -Format "yyyy-MM-dd HH:mm:ss") WIB |
| **Trigger** | Local PowerShell script |
| **Files** | schema.sql, data.sql |
| **pg_dump** | $pgVersion |

## Cara Restore

``````bash
# Set connection string
export DB_URL="postgresql://${USER_DB}:[PASSWORD]@${HOST_DB}:${PORT_DB}/${DBNAME}"

# 1. Restore schema
psql `$DB_URL -f backup/schema.sql

# 2. Restore data
psql `$DB_URL -f backup/data.sql
``````
"@
$manifestContent | Out-File -FilePath "$OUTDIR/MANIFEST.md" -Encoding UTF8

# --- Summary ---
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Backup Selesai!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "File yang dibuat:"

Get-ChildItem $OUTDIR | ForEach-Object {
    $size = [math]::Round($_.Length / 1KB, 1)
    Write-Host "  $($_.Name)  ($size KB)" -ForegroundColor White
}

Write-Host ""
Write-Host "Tips: Commit file backup ke git jika diperlukan:" -ForegroundColor DarkGray
Write-Host "  git add backup/ && git commit -m 'backup: $TIMESTAMP local'" -ForegroundColor DarkGray
Write-Host ""
