# load-env.ps1
param (
    [string]$EnvFile = ".env"
)

if (-Not (Test-Path $EnvFile)) {
    Write-Error "🚫 Could not find .env file at: $EnvFile"
    exit 1
}

# Read each line
Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()

    # Skip comments and empty lines
    if ($line -eq "" -or $line.StartsWith("#")) {
        return
    }

    # Split at first '='
    $key, $value = $line -split '=', 2

    if ($null -eq $value) {
        Write-Warning "⚠️ Skipping invalid line: $line"
        return
    }

    # Remove surrounding quotes (optional)
    $value = $value.Trim('"').Trim("'")

    # Set the environment variable
    Write-Host "🔧 Setting: $key = $value"
    [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
}

Write-Host "✅ Environment variables loaded successfully!"
