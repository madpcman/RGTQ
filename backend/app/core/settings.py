import os
from pydantic import (
    AnyUrl,
    BeforeValidator,
    EmailStr,
    HttpUrl,
    PostgresDsn,
    computed_field,
    model_validator,
)
from pydantic_settings import BaseSettings
from functools import lru_cache
from pydantic_core import MultiHostUrl
from typing import Literal

ENV = os.getenv("ENV", "development").lower()
ENV_FILE_MAP = {
    "development": ".env.dev",
    "dev": ".env.dev",
    "production": ".env.prod",
    "prod": ".env.prod",
}

class Settings(BaseSettings):
    # ENV: str = "development"
    ENV: str = "production"
    ENV: Literal["development", "production"] = ENV

    POSTGRES_SERVER: str
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""
    POSTGRES_QUERY: str = ""

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql+psycopg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
            query=self.POSTGRES_QUERY,
        )

    class Config:
        env_file = ENV_FILE_MAP.get(ENV, ".env.dev")

settings = Settings() 
