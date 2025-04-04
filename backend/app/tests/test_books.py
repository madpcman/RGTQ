

import pytest
from db import client
from fastapi.testclient import TestClient

def test_create_book(client):
    response = client.post("/books/", json={
        "title": "Test Book",
        "author": "Tester",
        "detail": {
            "description": "A book for testing.",
            "publisher": "TestPub",
            "year": 2024
        }
    })
    assert response.status_code == 200
    data = response.json()["detail"]
    assert data["item"]["title"] == "Test Book"
    assert data["item"]["author"] == "Tester"
    assert data["item"]["detail"]["publisher"] == "TestPub"
    global book_id
    book_id = data["item"]["id"]  # 후속 테스트에서 사용할 책 ID 저장


def test_get_books(client):
    response = client.get("/books/")
    assert response.status_code == 200
    data = response.json()["detail"]
    assert isinstance(data["items"], list)
    assert data["total"] >= 1


def test_get_book_by_id(client):
    response = client.get(f"/books/{book_id}")
    print ("book_id : " + str(book_id))
    assert response.status_code == 200
    data = response.json()["detail"]
    assert data["item"]["id"] == book_id
    assert data["item"]["title"] == "Test Book"

def test_err_book_by_id(client):
    response = client.get(f"/books/0")
    print ("book_id : " + str(book_id))
    assert response.status_code == 400
    assert response.json()["error"] == "ERR_400"


def test_update_book(client):
    response = client.put(f"/books/{book_id}", json={
        "title": "Updated Title",
        "author": "Updated Author",
        "detail": {
            "description": "Updated Description",
            "publisher": "UpdatedPub",
            "year": 2025
        }
    })
    assert response.status_code == 200
    data = response.json()["detail"]
    assert data["item"]["title"] == "Updated Title"
    assert data["item"]["detail"]["year"] == 2025


def test_delete_book(client):
    response = client.delete(f"/books/{book_id}")
    assert response.status_code == 200
    assert response.json()["detail"] == "Book and its details deleted successfully"


def test_get_deleted_book(client):
    response = client.get(f"/books/{book_id}")
    assert response.status_code == 404
    assert response.json()["error"] == "ERR_404"