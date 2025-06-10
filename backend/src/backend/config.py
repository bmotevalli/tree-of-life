from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    POSTGRE_URL: str
    DEBUG: bool = False
    SECRET: str
    ORIGINS: List[str] = []
    API_PRE_PATH: str = ''
    EMBED_UI: bool = False

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()