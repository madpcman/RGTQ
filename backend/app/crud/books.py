import json
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from fastapi import HTTPException
from app.models.books import Book, BookDetail
from app.schemas.books import BookCreate, BookUpdate, BookListResponse
from app.core.response import success_response

def get_books_with_details(
    db: Session,
    title: str = None,
    author: str = None,
    limit: int = 10,
    offset: int = 0
):
    query = db.query(Book).join(Book.detail)

    # 동적 필터 조건 추가
    if title or author:
        conditions = []
        if title:
            conditions.append(Book.title.ilike(f"%{title}%"))
        if author:
            conditions.append(Book.author.ilike(f"%{author}%"))
        query = query.filter(or_(*conditions))

    total = query.count()
    results = query.offset(offset).limit(limit).all()
    return success_response(data = {"total": total, "items": results})

def get_book_with_detail_by_id(db: Session, book_id: int):
    if not isinstance(book_id, int) or book_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid book ID")

    book = db.query(Book).options(joinedload(Book.detail)).filter(Book.id == book_id).first()

    if not book:
        raise HTTPException(status_code=404, detail=f"Book with ID {book_id} not found")

    print (book)
    return success_response(data = {"item" : book})

def create_book(db: Session, book_data: BookCreate):
    new_book = Book(title=book_data.title, author=book_data.author)
    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    # 🔹 BookDetail 데이터 추가
    if book_data.detail:
        new_detail = BookDetail(
            book_id=new_book.id,
            description=book_data.detail.description,
            publisher=book_data.detail.publisher,
            publishedDate=book_data.detail.publishedDate
        )
        db.add(new_detail)
        db.commit()
        db.refresh(new_detail)

    db.refresh(new_book)

    return success_response(data = {"item" : new_book})

def update_book(db: Session, book_id: int, book_data: BookUpdate):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if book_data.title is not None:
        book.title = book_data.title
    if book_data.author is not None:
        book.author = book_data.author

    db.commit()
    db.refresh(book)


    if book_data.detail:
        detail = db.query(BookDetail).filter(BookDetail.book_id == book_id).first()
        if not detail:
            # 책 상세 정보가 없는 경우 새로 추가
            detail = BookDetail(book_id=book_id)

        if book_data.detail.description is not None:
            detail.description = book_data.detail.description
        if book_data.detail.publisher is not None:
            detail.publisher = book_data.detail.publisher
        if book_data.detail.publishedDate is not None:
            detail.publishedDate = book_data.detail.publishedDate

        db.add(detail)
        db.commit()
        db.refresh(detail)

    db.refresh(book)

    return success_response(data = {"item" : book})

def delete_book(db: Session, book_id: int):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # 🔹 BookDetail 먼저 삭제
    detail = db.query(BookDetail).filter(BookDetail.book_id == book_id).first()
    if detail:
        db.delete(detail)

    # 🔹 Book 삭제
    db.delete(book)
    db.commit()
    
    return success_response(None, "Book and its details deleted successfully")