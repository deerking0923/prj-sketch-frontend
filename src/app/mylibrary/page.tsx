"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./mylibrary.css";

interface ProfileData {
  name: string;
  email: string;
}

interface Book {
  id: number;
  userId: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  description: string;
  thumbnail: string;
  personalReview: string;
  quotes: string;
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

  const API_GATEWAY_URL = "http://localhost:8000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    // 1) 실제 사용자 정보 (name, email 등) 불러오기
    const userUrl = `${API_GATEWAY_URL}/user-service/users/${userId}`;
    axios
      .get(userUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setProfile({
          name: res.data.name,
          email: res.data.email,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
      });

    // 2) 내 서재 책 목록 불러오기
    const libraryUrl = `${API_GATEWAY_URL}/mylibrary-service/${userId}/booklist`;
    axios
      .get(libraryUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch book list:", err);
      });
  }, [router]);

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
    router.push("/profile");
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
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="page-btn"
            >
              이전
            </button>
            <span className="page-info">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              다음
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyLibraryPage;
