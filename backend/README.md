# Alembic

This libs helps with code first DB set up.

## Add new table

Simply add a new model in `backend.db.models`.
Import the model in `alembic>env.py`.
Make sure your backend and db are running via docker-compose.

On WinOS:

alembic.ps1 -migrate "migration message"
alembic.ps1 -updateDb

On Linux
...
