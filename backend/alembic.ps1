param (
    [string]$migration,   # The migration message (if provided)
    [switch]$updateDb     # Flag to apply migrations
)

if ($migration) {
    Write-Host "🔧 Generating migration with message: '$migration'"
    docker-compose exec backend alembic revision --autogenerate -m "$migration"
}
elseif ($updateDb) {
    Write-Host "🚀 Applying migrations to the database..."
    docker-compose exec backend alembic upgrade head
}
else {
    Write-Host "❌ Please provide either -migration 'message' or -updateDb switch."
    Write-Host "Usage examples:"
    Write-Host "  .\alembic.ps1 -migration 'Add user table'"
    Write-Host "  .\alembic.ps1 -updateDb"
    exit 1
}
