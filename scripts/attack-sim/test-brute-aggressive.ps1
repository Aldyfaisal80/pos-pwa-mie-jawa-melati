$url = 'https://hrzvdledrengvxuzmsbk.supabase.co/auth/v1/token?grant_type=password'
$anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyenZkbGVkcmVuZ3Z4dXptc2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMzc0OTQsImV4cCI6MjA4ODYxMzQ5NH0.TE2D9UjDbRu8DmYqsx4bjT8Pn5SaySVwwAAXfYAzq1k'

Write-Host '=== ATTACK 1 (AGGRESSIVE): Auth Brute Force 100x No Delay ===' -ForegroundColor Red
Write-Host "Target: $url" -ForegroundColor DarkGray

$client = New-Object System.Net.WebClient
$client.Headers.Add('Content-Type', 'application/json')
$client.Headers.Add('apikey', $anonKey)

$pass429 = 0
$pass400 = 0
$fail = 0
$firstRateLimit = 0

for ($i = 1; $i -le 100; $i++) {
    $body = '{"email":"admin@toko.com","password":"brutepass' + $i + '"}'
    try {
        $r = $client.UploadString($url, 'POST', $body)
        $fail++
        Write-Host ("  [$i] HTTP 200 FAIL - " + $r.Substring(0, [Math]::Min(60, $r.Length))) -ForegroundColor Red
    } catch [System.Net.WebException] {
        $httpResp = $_.Exception.Response
        $sc = [int]$httpResp.StatusCode
        $reader = New-Object System.IO.StreamReader($httpResp.GetResponseStream())
        $bd = $reader.ReadToEnd()
        $parsed = $bd | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($parsed.error_description) { $msg = $parsed.error_description }
        elseif ($parsed.message) { $msg = $parsed.message }
        elseif ($parsed.error) { $msg = $parsed.error }
        else { $msg = $bd.Substring(0, [Math]::Min(80, $bd.Length)) }

        if ($sc -eq 429) {
            $pass429++
            if ($firstRateLimit -eq 0) {
                $firstRateLimit = $i
                Write-Host ("  [$i] HTTP 429 RATE LIMIT HIT first at attempt #$i") -ForegroundColor Green
            } elseif ($i % 25 -eq 0) {
                Write-Host ("  [$i] HTTP 429 still blocking... total=$pass429") -ForegroundColor Green
            }
        } elseif ($sc -eq 400) {
            $pass400++
            if ($i -le 5) {
                Write-Host ("  [$i] HTTP 400 | $msg") -ForegroundColor Yellow
            }
        } else {
            $fail++
            Write-Host ("  [$i] HTTP $sc | $msg") -ForegroundColor Red
        }
    }
}

Write-Host ''
Write-Host '====================================' -ForegroundColor Cyan
Write-Host ' ATTACK 1 SUMMARY' -ForegroundColor Cyan
Write-Host '====================================' -ForegroundColor Cyan
Write-Host ("  Total attempts   : 100")
Write-Host ("  HTTP 429 (block) : $pass429") -ForegroundColor Green
Write-Host ("  HTTP 400 (wrong) : $pass400") -ForegroundColor Yellow
Write-Host ("  FAIL (200/other) : $fail") -ForegroundColor Red
if ($firstRateLimit -gt 0) {
    Write-Host ("  First 429 at     : attempt #$firstRateLimit") -ForegroundColor Green
}

Write-Host ''
if ($pass429 -gt 0) {
    Write-Host 'RESULT: [PASS] Rate limiting ACTIVE' -ForegroundColor Green
} elseif ($fail -eq 0) {
    Write-Host 'RESULT: [PARTIAL] Wrong creds rejected but no 429 rate limit detected' -ForegroundColor Yellow
} else {
    Write-Host 'RESULT: [FAIL] No rate limiting detected!' -ForegroundColor Red
}
