# backend/Dockerfile
FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libffi-dev \
    musl-dev \
    libpq-dev \
    gdal-bin \
    libgdal-dev \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV GDAL_CONFIG=/usr/bin/gdal-config

WORKDIR /app

# Copy backend source
COPY backend/src/ /app/src/
COPY backend/pyproject.toml /app
COPY backend/poetry.lock /app
COPY backend/README.md /app

# Copy wait-for-it script
COPY backend/wait-for-it.sh /app/
RUN chmod +x /app/wait-for-it.sh

# Install Poetry & backend dependencies
RUN pip install --upgrade pip && \
    pip install poetry==2.1.3 && \
    poetry install --without dev --with deploy

# Environment variables
ENV PORT=8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/ || exit 1

EXPOSE 8080

# Optional: use entrypoint script if needed
# ENTRYPOINT ["/app/scripts/entrypoint.sh"]

# Command to run the app
CMD poetry run uvicorn src.backend.main:app --host 0.0.0.0 --port 8080
