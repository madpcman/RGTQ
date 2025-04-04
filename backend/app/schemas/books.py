from pydantic import BaseModel
from typing import List, Optional

class BookDetailSchema(BaseModel):
    description: str
    publisher: str
    year: int

    class Config:
        orm_mode = True

class BookSchema(BaseModel):
    id: int
    title: str
    author: str
    detail: Optional[BookDetailSchema] = None

    class Config:
        orm_mode = True

class BookCreate(BaseModel):
    title: str
    author: str
    detail: Optional[BookDetailSchema] = None

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    detail: Optional[BookDetailSchema] = None




class BookListResponse(BaseModel):
    total: int
    items: List[BookSchema]

class BookDetailResponse(BaseModel):
    message: Optional[str] = None
    item : Optional[BookSchema] = None

class FormBookListResponse(BaseModel):
    error: str
    detail: BookListResponse

class FormBookResponse(BaseModel):
    error: str
    detail: BookDetailResponse