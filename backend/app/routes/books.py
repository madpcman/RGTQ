from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas
from app.database import get_db
from app.schemas.books import BookSchema, FormBookListResponse, FormBookResponse, BookCreate, BookUpdate
from app.crud.books import get_books_with_details, get_book_with_detail_by_id, create_book, update_book, delete_book


router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/", response_model=FormBookListResponse)
def read_books(
    title: Optional[str] = Query(None),
    author: Optional[str] = Query(None),
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    db: Session = Depends(get_db)):
    return get_books_with_details(db, title=title, author=author, offset=offset, limit=limit)

@router.get("/{book_id}", response_model=FormBookResponse)
def read_book(book_id: int, db: Session = Depends(get_db)):
    return get_book_with_detail_by_id(db, book_id)

@router.post("/", response_model=FormBookResponse)
def add_book(book_data: BookCreate, db: Session = Depends(get_db)):
    return create_book(db, book_data)

@router.put("/{book_id}", response_model=FormBookResponse)
def modify_book(book_id: int, book_data: BookUpdate, db: Session = Depends(get_db)):
    return update_book(db, book_id, book_data)

@router.delete("/{book_id}")
def remove_book(book_id: int, db: Session = Depends(get_db)):
    return delete_book(db, book_id)
