'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchBook } from "@/app/lib/api";
import BookDetailView from "@/app/components/BookDetailView";
import toast from "react-hot-toast";
import { Book } from "@/app/models/book";

// 중앙 정렬을 위한 스타일
const centeredStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh', // 화면 전체 높이를 차지하도록 설정
};

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Partial<Book> | null>(null); // 수정된 부분

  useEffect(() => {
    const loadBook = async () => {
      try {
        const fetchedBook = await fetchBook(Number(id));
        setBook(fetchedBook); // 정상적으로 `Partial<Book>`나 `null` 타입 처리
      } catch (error) {
        console.log(error);
        toast.error("책 정보를 불러오는 데 실패했습니다.");
      }
    };

    if (id) {
      loadBook();
    }
  }, [id]);

  if (!book) return <div style={centeredStyle} >존재하지 않는 책입니다.</div>;

  return <BookDetailView book={book as Book} />;
}
