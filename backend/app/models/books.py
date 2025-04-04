from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)

    detail = relationship("BookDetail", back_populates="book", uselist=False)

class BookDetail(Base):
    __tablename__ = "book_details"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    description = Column(String)
    publisher = Column(String)
    year = Column(Integer)

    book = relationship("Book", back_populates="detail")

