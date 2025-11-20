# test-api.ps1
# Usage: Open PowerShell in the folder and run: .\test-api.ps1

# 1) Login (or use existing token)
$loginResp = curl -Method POST http://localhost:5000/api/auth/login `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"email":"harsha@yopmail.com","password":"zxcvbnm"}' -UseBasicParsing
$loginJson = $loginResp.Content | ConvertFrom-Json
$token = $loginJson.token
if (-not $token) {
  Write-Host "Login failed. Response:" $loginResp.Content
  exit 1
}
Write-Host "Token obtained."

# Set env var for this session
$env:TOKEN = $token

# 2) Post an activity
$postResp = curl -Method POST http://localhost:5000/api/activities `
  -Headers @{
    "Content-Type" = "application/json";
    "Authorization" = "Bearer $env:TOKEN"
  } `
  -Body '{"type":"Running","duration":30,"intensity":"Medium","calories":300,"steps":4000,"distanceKm":4}' -UseBasicParsing
Write-Host "Post activity response:" $postResp.Content

# 3) Get dashboard
$dashResp = curl -Method GET http://localhost:5000/api/users/dashboard `
  -Headers @{ "Authorization" = "Bearer $env:TOKEN" } -UseBasicParsing
Write-Host "Dashboard response:" $dashResp.Content
