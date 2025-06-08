# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml poetry.lock* README.md ./
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
COPY ./src ./src

RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-interaction

RUN pip install debugpy

ENV PYTHONPATH=/app/src
