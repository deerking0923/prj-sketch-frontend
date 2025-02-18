"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./mylibrary.css";

interface ProfileData {
  nickname: string;
  email: string;
  likedPosts: number;
  recentPosts: number;
  likedBooks: number;
  recentComments: number;
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
  pdate: string | null; // 보통 null
}

const MyLibraryPage: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  // API 게이트웨이 URL은 환경 변수로 관리 (NEXT_PUBLIC_ 접두사를 붙여 브라우저에서도 사용 가능)
  const API_GATEWAY_URL = "http://localhost:8000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // 로그인 토큰이나 사용자 ID가 없으면 로그인 페이지로 이동
    if (!token || !userId) {
      router.push("/login");
      return;
    }

    // 프로필 정보는 나중에 API로 받아올 수 있으나, 우선 더미 데이터 사용
    setProfile({
      nickname: "별명예시",
      email: "example@email.com",
      likedPosts: 10,
      recentPosts: 5,
      likedBooks: 7,
      recentComments: 3,
    });

    // API 게이트웨이를 통해 내 서재 책 목록을 가져옴
    const apiUrl = `${API_GATEWAY_URL}/mylibrary-service/${userId}/booklist`;
    axios
      .get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // res.data가 배열 형태의 책 목록이라고 가정
        setBooks(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch book list:", err);
      });
  }, [router]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  // 책 카드 클릭 시 상세 페이지로 이동 (예: /mylibrary/[id])
  const handleBookClick = (id: number) => {
    router.push(`/mylibrary/${id}`);
  };

  return (
    <div className="mylibrary-container">
      {/* 프로필 섹션 */}
      <section className="profile-section">
        <div className="profile-info">
          <h2>{profile.nickname}</h2>
          <p>{profile.email}</p>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span>좋아요한 게시물</span>
            <span>{profile.likedPosts}</span>
          </div>
          <div className="stat-item">
            <span>최근에 쓴 게시물</span>
            <span>{profile.recentPosts}</span>
          </div>
          <div className="stat-item">
            <span>좋아요한 도서</span>
            <span>{profile.likedBooks}</span>
          </div>
          <div className="stat-item">
            <span>최근에 쓴 댓글</span>
            <span>{profile.recentComments}</span>
          </div>
        </div>
      </section>

      {/* 내 서재 책 목록 섹션 */}
      <section className="books-section">
        <h2>내 서재</h2>
        <div className="books-grid">
          {books.map((book) => (
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
      </section>
    </div>
  );
};

export default MyLibraryPage;
