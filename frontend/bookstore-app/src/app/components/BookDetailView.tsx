'use client';

import { Book } from "@/app/models/book";
import { useRouter } from "next/navigation";
import BookForm from "@/app/components/BookForm";

export default function BookDetailView({ book }: { book: Book }) {
  const router = useRouter();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">책 정보</h1>
      <BookForm initialData={book} readOnly />
      <button
        onClick={() => router.push("/books")}
        className="mt-6 text-blue-600 underline"
      >
        ← 목록으로 돌아가기
      </button>
    </div>
  );
}
