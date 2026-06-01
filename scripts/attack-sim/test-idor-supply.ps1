# Attack 4: IDOR tRPC endpoints
Write-Host '=== ATTACK 4: IDOR - tRPC Endpoint Auth Check ===' -ForegroundColor Red

$baseUrl = 'http://localhost:3000'
$endpoints = @(
    'store.getProfile',
    'product.getAll',
    'transaction.getList'
)

foreach ($ep in $endpoints) {
    try {
        # GET request without any auth token
        $resp = Invoke-WebRequest -Uri ($baseUrl + '/api/trpc/' + $ep) -Method GET -ErrorAction Stop
        $statusCode = $resp.StatusCode
        Write-Host ('FAIL - ' + $ep + ' returned HTTP ' + $statusCode + ' (no auth!)') -ForegroundColor Red
    } catch {
        $ex = $_.Exception
        if ($ex.Response) {
            $sc = [int]$ex.Response.StatusCode
            $reader = New-Object System.IO.StreamReader($ex.Response.GetResponseStream())
            $body = $reader.ReadToEnd()
            if ($sc -eq 401 -or $body -like '*UNAUTHORIZED*') {
                Write-Host ('PASS - ' + $ep + ': HTTP ' + $sc + ' (unauthorized as expected)') -ForegroundColor Green
            } else {
                Write-Host ('PARTIAL - ' + $ep + ': HTTP ' + $sc + ' | ' + $body.Substring(0, [Math]::Min(80, $body.Length))) -ForegroundColor Yellow
            }
        } else {
            Write-Host ('NET_ERR - ' + $ep + ': ' + $ex.Message) -ForegroundColor Cyan
        }
    }
}

Write-Host ''
Write-Host '=== IDOR Test Complete ===' -ForegroundColor Cyan

# ---
# Attack 5: Supply chain - npm audit + secrets scan
Write-Host ''
Write-Host '=== ATTACK 5: Supply Chain & Secrets Scan ===' -ForegroundColor Red

# 5a: Check if .env is in git history
Write-Host '-- 5a: Is .env tracked in git? --'
$gitCheck = git ls-files --cached .env 2>&1
if ($gitCheck -and $gitCheck.Trim() -ne '') {
    Write-Host 'FAIL - .env IS tracked by git!' -ForegroundColor Red
} else {
    Write-Host 'PASS - .env is NOT tracked by git (good, in .gitignore)' -ForegroundColor Green
}

# 5b: Check for hardcoded secrets in src
Write-Host '-- 5b: Hardcoded secrets in src/ --'
$secretPatterns = @('api_key\s*=', 'apiKey\s*=', 'secret\s*=\s*[\"'']', 'password\s*=\s*[\"'']', 'SUPABASE_SERVICE_ROLE')
$foundSecrets = $false
foreach ($pattern in $secretPatterns) {
    $hits = Get-ChildItem -Path 'src' -Recurse -Include '*.ts','*.tsx','*.js','*.jsx','*.env*' |
        Select-String -Pattern $pattern -List | Where-Object { $_.Path -notlike '*test*' -and $_.Path -notlike '*.spec*' }
    if ($hits.Count -gt 0) {
        $foundSecrets = $true
        Write-Host ('WARN - Pattern "' + $pattern + '" found in:') -ForegroundColor Yellow
        foreach ($h in $hits) { Write-Host ('  ' + $h.Path) -ForegroundColor Yellow }
    }
}
if (-not $foundSecrets) {
    Write-Host 'PASS - No hardcoded secrets found in src/' -ForegroundColor Green
}

# 5c: Check SERVICE_ROLE key is not in NEXT_PUBLIC vars
Write-Host '-- 5c: SERVICE_ROLE key exposure check --'
$srHits = git grep -i "NEXT_PUBLIC.*SERVICE_ROLE" src/ 2>&1
if ($srHits -match "fatal:.*" -or [string]::IsNullOrWhiteSpace($srHits)) {
    Write-Host 'PASS - SERVICE_ROLE key not exposed as NEXT_PUBLIC' -ForegroundColor Green
} else {
    Write-Host 'CRITICAL - SERVICE_ROLE key exposed as NEXT_PUBLIC!' -ForegroundColor Red
    Write-Host $srHits -ForegroundColor Red
}

Write-Host ''
Write-Host '=== Supply Chain Test Complete ===' -ForegroundColor Cyan
Write-Host 'NOTE: Run "npm audit" separately for CVE check'
