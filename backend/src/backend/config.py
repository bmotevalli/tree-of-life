from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    POSTGRE_URL: str
    DEBUG: bool = False
    SECRET: str
    ORIGINS: List[str] = []

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()