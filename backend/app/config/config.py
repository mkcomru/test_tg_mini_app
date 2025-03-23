from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    BIRTHDAY_DB_URL: str
    BOT_TOKEN: str
    WEBAPP_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()


