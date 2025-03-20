"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./mylibrary.css";

interface ProfileData {
  // Spring Boot /api/v1/auth/me 엔드포인트의 반환 구조에 맞춤 (예: { id, username, email })
  name: string; // 보통 username을 name으로 사용
  email: string;
}

interface Book {
  id: number;
  userId: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  description: string;
  thumbnail: string;
  personalReview: string;
  quotes: string[]; // 실제 데이터 구조에 따라 수정
  startDate: string;
  endDate: string;
  pdate: string | null;
}

const MyLibraryPage: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  useEffect(() => {
    // withCredentials 옵션을 사용하여 쿠키가 자동 전송되도록 함... 도메인 설정.
    axios
      .get(`${API_GATEWAY_URL}/api/v1/auth/me`, { withCredentials: true })
      .then((res) => {
        // 백엔드 응답 구조가 { id, username, email }이라고 가정
        setProfile({
          name: res.data.username,
          email: res.data.email,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
        router.push("/login");
      });

    axios
      .get(`${API_GATEWAY_URL}/mylibrary-service/booklist`, { withCredentials: true })
      .then((res) => {
        console.log("Book list response:", res.data);
        let bookArray: Book[] = [];
        if (Array.isArray(res.data)) {
          bookArray = res.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          bookArray = res.data.data;
        } else if (res.data.content && Array.isArray(res.data.content)) {
          bookArray = res.data.content;
        } else {
          console.error("Unexpected book list response format:", res.data);
        }
        setBooks(bookArray);
      })
      .catch((err) => {
        console.error("Failed to fetch book list:", err);
      });
  }, [router, API_GATEWAY_URL]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  // 책 상세 페이지 이동
  const handleBookClick = (id: number) => {
    router.push(`/mylibrary/${id}`);
  };

  // 페이지네이션 로직
  const totalBooks = books.length;
  const totalPages = Math.ceil(totalBooks / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentBooks = books.slice(startIndex, endIndex);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // 프로필 페이지로 이동 버튼
  const goToProfilePage = () => {
    router.push("/users/profile");
  };

  return (
    <div className="mylibrary-container">
      {/* 프로필 섹션 */}
      <section className="profile-section">
        <div className="profile-top">
          <div className="profile-info">
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
          </div>
          <button className="profile-button" onClick={goToProfilePage}>
            내 프로필 페이지
          </button>
        </div>
      </section>

      {/* 책 목록 섹션 */}
      <section className="books-section">
        <h2>내 서재</h2>
        <div className="books-grid">
          {currentBooks.map((book) => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => handleBookClick(book.id)}
              style={{ cursor: "pointer" }}
            >
              <img src={book.thumbnail} alt={book.title} />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>{book.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="page-btn">
              이전
            </button>
            <span className="page-info">
              {currentPage} / {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="page-btn">
              다음
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyLibraryPage;
