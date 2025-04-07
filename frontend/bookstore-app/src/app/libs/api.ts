import { Book } from "@/app/models/book";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE; // 백엔드 주소


export async function fetchBooks(page = 1, perPage: number, title = "", author = "") {
    const offset = (page - 1) * perPage;
  
    const params = new URLSearchParams({
        limit: perPage.toString(),
        offset: offset.toString(),
    });

    if (title) params.append("title", title);
    if (author) params.append("author", author);
  
    const res = await fetch(`${API_BASE}/books?${params.toString()}`);
    if (!res.ok) {
        throw new Error("책 목록을 불러오는 데 실패했습니다.");
    }
  
    const data = await res.json();
  
    // ✅ 응답 구조 대응
    return {
        total: data.detail.total,
        items: data.detail.items,
    };
}

export async function fetchBook(id: number): Promise<Book> {
    const res = await fetch(`${API_BASE}/books/${id}`);
    if (!res.ok) {
        throw new Error("책 목록을 불러오는 데 실패했습니다.");
    }

    const data = await res.json();
    // ✅ 응답 구조 대응
    return data.detail.item;
}

export async function createBook(data: Partial<Book>) {
    const cleanData = {
        ...data,
        detail: {
          ...data.detail,
          publishedDate: data.detail?.publishedDate
            ? new Date(data.detail.publishedDate).toISOString().split("T")[0]
            : undefined,
        },
    };

    const res = await fetch(`${API_BASE}/books/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
    });
    return res.json();
}

export async function updateBook(id: number, data: Partial<Book>) {

    const cleanData = {
        ...data,
        detail: {
          ...data.detail,
          publishedDate: data.detail?.publishedDate
            ? new Date(data.detail.publishedDate).toISOString().split("T")[0]
            : undefined,
        },
    };

    const res = await fetch(`${API_BASE}/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
    });
    return res.json();
}

export async function deleteBook(id: number) {
    await fetch(`${API_BASE}/books/${id}`, { method: "DELETE" });
}
