from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    POSTGRE_URL: str
    DEBUG: bool = False
    SECRET: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()