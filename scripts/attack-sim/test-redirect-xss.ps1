# Attack 2: Open Redirect test
$tests = @(
    @{ label = 'Test 1: External HTTPS'; redirect = 'https://evil.com' },
    @{ label = 'Test 2: Protocol-relative //'; redirect = '//evil.com' },
    @{ label = 'Test 3: Triple slash ///'; redirect = '///evil.com' },
    @{ label = 'Test 4: URL-encoded %2F%2F'; redirect = '%2F%2Fevil.com' },
    @{ label = 'Test 5: Valid internal /dashboard'; redirect = '/dashboard' },
    @{ label = 'Test 6: Backslash \\evil.com'; redirect = '\evil.com' }
)

Write-Host '=== ATTACK 2: Open Redirect Bypass ===' -ForegroundColor Red
Write-Host 'Testing redirect sanitization in use-login-form.ts'
Write-Host ''

# Simulate the logic in use-login-form.ts:
# rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/"
foreach ($test in $tests) {
    $raw = $test.redirect
    $safe = if ($raw.StartsWith('/') -and -not $raw.StartsWith('//')) { $raw } else { '/' }
    $isVuln = ($safe -ne '/') -and (-not $safe.StartsWith('/dashboard') -and -not $safe -eq '/dashboard')
    $isExternal = $safe.Contains('evil') -or $safe.StartsWith('http') -or $safe.StartsWith('//')

    if ($isExternal) {
        $result = 'FAIL - could redirect to: ' + $safe
        $color = 'Red'
    } elseif ($safe -eq '/') {
        $result = 'PASS - sanitized to: /'
        $color = 'Green'
    } elseif ($safe -eq '/dashboard') {
        $result = 'PASS - allowed internal: /dashboard'
        $color = 'Green'
    } else {
        $result = 'CHECK - redirects to: ' + $safe
        $color = 'Yellow'
    }

    Write-Host ($test.label + ': ' + $result) -ForegroundColor $color
}

Write-Host ''
Write-Host '=== Open Redirect Test Complete ===' -ForegroundColor Cyan

# ---
# Attack 3: XSS check - grep for dangerouslySetInnerHTML
Write-Host ''
Write-Host '=== ATTACK 3: XSS - Scanning for dangerouslySetInnerHTML ===' -ForegroundColor Red

$hits = Get-ChildItem -Path 'src' -Recurse -Include '*.tsx','*.ts','*.jsx','*.js' |
    Select-String -Pattern 'dangerouslySetInnerHTML' -List

if ($hits.Count -eq 0) {
    Write-Host 'PASS - No dangerouslySetInnerHTML found in src/' -ForegroundColor Green
} else {
    Write-Host ('WARN - Found ' + $hits.Count + ' occurrence(s):') -ForegroundColor Yellow
    foreach ($h in $hits) {
        Write-Host ('  ' + $h.Path + ':' + $h.LineNumber) -ForegroundColor Yellow
    }
}

# Also check for eval() usage
$evalHits = Get-ChildItem -Path 'src' -Recurse -Include '*.tsx','*.ts','*.jsx','*.js' |
    Select-String -Pattern '\beval\s*\(' -List

if ($evalHits.Count -eq 0) {
    Write-Host 'PASS - No eval() usage found in src/' -ForegroundColor Green
} else {
    Write-Host ('WARN - eval() found in ' + $evalHits.Count + ' file(s)') -ForegroundColor Yellow
    foreach ($h in $evalHits) { Write-Host ('  ' + $h.Path) -ForegroundColor Yellow }
}

Write-Host ''
Write-Host '=== XSS Static Scan Complete ===' -ForegroundColor Cyan
