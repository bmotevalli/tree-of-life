#!/bin/bash

# Parse command line arguments
MIGRATION_MSG=""
UPDATE_DB=false

while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -m|--migration)
        MIGRATION_MSG="$2"
        shift 2
        ;;
        -update-db|--update-db)
        UPDATE_DB=true
        shift
        ;;
        *)
        echo "❌ Unknown option: $1"
        echo "Usage:"
        echo "  ./alembic.sh -m 'Your migration message'"
        echo "  ./alembic.sh -update-db"
        exit 1
        ;;
    esac
done

if [[ -n "$MIGRATION_MSG" ]]; then
    echo "🔧 Generating migration with message: '$MIGRATION_MSG'"
    docker-compose exec backend alembic revision --autogenerate -m "$MIGRATION_MSG"
elif [[ "$UPDATE_DB" == true ]]; then
    echo "🚀 Applying migrations to the database..."
    docker-compose exec backend alembic upgrade head
else
    echo "❌ Please provide either -m 'message' or -update-db option."
    echo "Usage:"
    echo "  ./alembic.sh -m 'Your migration message'"
    echo "  ./alembic.sh -update-db"
    exit 1
fi
