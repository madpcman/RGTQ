'use client';

import { useRouter } from "next/navigation";
import { createBook } from "@/app/libs/api";
import BookForm from "@/app/components/BookForm";
import toast from "react-hot-toast";
import { Book } from "@/app/models/book";

export default function NewBookPage() {
  const router = useRouter();

  const handleCreate = async (data : Partial<Book>) => {
    const toastId = toast.loading("책 등록 중...");
    try {
      await createBook(data);
      toast.success("책이 등록되었습니다!", { id: toastId });
      router.push("/books");
    } catch (error) {
      console.error("등록 실패:", error);
      toast.error("책 등록에 실패했습니다.", { id: toastId });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">새 책 추가</h1>
      <BookForm onSubmit={handleCreate} submitLabel="등록" />
    </div>
  );
}
