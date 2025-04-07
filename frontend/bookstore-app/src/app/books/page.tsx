'use client';

import { useEffect, useState } from "react";
import { Book } from "@/app/models/book";
import { fetchBooks, deleteBook } from "@/app/libs/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { debounce } from "lodash";

// Material UI Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Pagination from "@/app/components/Pagination";

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const totalPages = Math.ceil(total / booksPerPage);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { items, total } = await fetchBooks(page, booksPerPage, searchQuery, searchQuery);
        setBooks(items);
        setTotal(total);
      } catch (err) {
        console.error(err);
        toast.error("책 목록 로딩 실패");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchQuery, page, booksPerPage]);

  useEffect(() => {
    const debounced = debounce(() => {
      setPage(1);
      setSearchQuery(search);
    }, 500);

    debounced();
    return () => debounced.cancel();
  }, [search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(search);
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    const toastId = toast.loading("삭제 중...");
    try {
      await deleteBook(Number(id));
      setBooks(prev => prev.filter(book => book.id !== Number(id)));
      toast.success("삭제되었습니다.", { id: toastId });
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            toast.error("삭제 실패: " + err.message, { id: toastId });
        } else {        
            console.error("알 수 없는 오류", err);
            toast.error("삭제 실패: 알 수 없는 오류", { id: toastId });
        }
    }
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBooksPerPage(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSearchSubmit} className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="제목 또는 저자 로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-gray-500 hover:bg-gray-700 text-sm px-3 py-2 rounded flex items-center gap-1"
          >
            <SearchIcon fontSize="small" />
            검색
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label>한 페이지:</label>
          <select
            value={booksPerPage}
            onChange={handlePerPageChange}
            className="border p-1 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 5, 10, 20, 50].map(num => (
                <option key={num} value={num} className="bg-white text-gray-800">
                    {num}개
                </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => router.push("/books/new")}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <AddIcon fontSize="small" />
            새 책 추가
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center p-4">로딩 중...</div>
      ) : (
        <>
          <table className="w-full border">
            <thead>
                <tr className="bg-gray-200 text-gray-700 text-left">
                  <th className="p-2 w-[25%]">제목</th>
                  <th className="p-2 w-[20%]">저자</th>
                  <th className="p-2 w-[20%]">발행일</th>
                  <th className="p-2 w-[10%] text-center">판매량</th>
                  <th className="p-2 w-[10%] text-center">재고량</th>
                  <th className="p-2 w-[15%] text-right">작업</th>
                </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={String(book.id)} className="border-t">
                  <td
                    className="p-2 w-[25%] cursor-pointer text-blue-600"
                    onClick={() => router.push(`/books/${book.id}`)}
                  >
                    {book.title}
                  </td>
                  <td className="p-2 w-[20%]">{book.author}</td>
                  <td className="p-2 w-[20%]"> {new Date(book.detail.publishedDate).toISOString().split('T')[0]}</td>
                  <td className="p-2 w-[10%] text-center">{book.detail.sellCount}</td>
                  <td className="p-2 w-[10%] text-center">{book.detail.stockCount}</td>
                  <td className="p-2 w-[15%] space-x-2 text-right">
                    <button
                      onClick={() => router.push(`/books/${book.id}/edit?edit=true`)}
                      className="text-sm bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded inline-flex items-center gap-1"
                    >
                      <EditIcon fontSize="small" />
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(String(book.id))}
                      className="text-sm bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded inline-flex items-center gap-1"
                    >
                      <DeleteIcon fontSize="small" />
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    책이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
            />
          </div>
        </>
      )}
    </div>
  );
}
