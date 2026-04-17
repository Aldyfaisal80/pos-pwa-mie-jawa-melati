$url = 'https://hrzvdledrengvxuzmsbk.supabase.co/auth/v1/token?grant_type=password'
$anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyenZkbGVkcmVuZ3Z4dXptc2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMzc0OTQsImV4cCI6MjA4ODYxMzQ5NH0.TE2D9UjDbRu8DmYqsx4bjT8Pn5SaySVwwAAXfYAzq1k'

Write-Host '=== ATTACK 1: Auth Brute Force (15 attempts, 300ms gap) ===' -ForegroundColor Red

# Use .NET WebClient for full response regardless of status code
$client = New-Object System.Net.WebClient
$client.Headers.Add('Content-Type', 'application/json')
$client.Headers.Add('apikey', $anonKey)

for ($idx = 1; $idx -le 15; $idx++) {
    $body = '{"email":"admin@toko.com","password":"wrongpass' + $idx + '"}'
    try {
        $rawResp = $client.UploadString($url, 'POST', $body)
        try { $parsed = $rawResp | ConvertFrom-Json; $errMsg = if ($parsed.access_token) { 'LOGIN SUCCESS!' } else { $rawResp } } catch { $errMsg = $rawResp }
        Write-Host ('Attempt ' + $idx + ': HTTP 200 | ' + $errMsg) -ForegroundColor Red
    } catch [System.Net.WebException] {
        $httpResp = $_.Exception.Response
        $statusCode = [int]$httpResp.StatusCode
        $reader = New-Object System.IO.StreamReader($httpResp.GetResponseStream())
        $rawBody = $reader.ReadToEnd()
        try {
            $parsed = $rawBody | ConvertFrom-Json
            $errMsg = if ($parsed.error_description) { $parsed.error_description } elseif ($parsed.message) { $parsed.message } elseif ($parsed.error) { $parsed.error } else { $rawBody }
        } catch { $errMsg = $rawBody }
        $color = if ($statusCode -eq 429) { 'Green' } elseif ($statusCode -eq 400) { 'Yellow' } else { 'Red' }
        Write-Host ('Attempt ' + $idx + ': HTTP ' + $statusCode + ' | ' + $errMsg) -ForegroundColor $color
    }
    Start-Sleep -Milliseconds 300
}

Write-Host ''
Write-Host '=== Brute Force Test Complete ===' -ForegroundColor Cyan
Write-Host 'GREEN = 429 Rate Limited (PASS) | YELLOW = 400 Wrong creds | RED = FAIL'
