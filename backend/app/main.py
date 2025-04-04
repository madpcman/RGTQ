from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.routes import books  # 라우터 import

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(
    title="Book API",
    description="책 목록 API with FastAPI",
    version="1.0.0"
)

# CORS (필요 시 도메인 추가)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발용 전체 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(books.router)


@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": f"ERR_{exc.status_code}",
            "detail": exc.detail,
        },
    )