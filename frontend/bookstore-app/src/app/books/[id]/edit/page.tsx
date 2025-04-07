'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchBook, updateBook } from "@/app/lib/api";
import { Book } from "@/app/models/book";
import BookForm from "@/app/components/BookForm";
import toast from "react-hot-toast";

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = Number(params.id);
  const [book, setBook] = useState<Partial<Book> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchBook(bookId);
        setBook(data);
      } catch (err) {
        console.log(err);
        toast.error("책 정보를 불러오는 데 실패했습니다.");
      }
    };
    load();
  }, [bookId]);

  const handleUpdate = async (data: Partial<Book>) => {
    const toastId = toast.loading("수정 중...");
    try {
      await updateBook(bookId, data);
      toast.success("책이 수정되었습니다!", { id: toastId });
      router.push(`/books/${bookId}`);
    } catch (error) {
      console.error("수정 실패:", error);
      toast.error("책 수정에 실패했습니다.", { id: toastId });
    }
  };

  if (!book) return <div className="text-center p-4">로딩 중...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">책 정보 수정</h1>
      <BookForm initialData={book} onSubmit={handleUpdate} submitLabel="수정" />
      <button
        onClick={() => router.push("/books")}
        className="mt-6 text-blue-600 underline"
      >
        ← 목록으로 돌아가기
      </button>
    </div>
  );
}
