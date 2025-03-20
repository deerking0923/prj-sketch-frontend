"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import "./mylibraryDetail.css";

interface BookQuoteDto {
  id: number;
  pageNumber: string;
  quoteText: string;
}

interface UserBookDetail {
  id: number;
  userId: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  pDate: string | null;
  description: string;
  thumbnail: string;
  personalReview: string;
  quotes: BookQuoteDto[];
  startDate: string;
  endDate: string;
}

interface ProfileData {
  id: number;
  username: string;
  email: string;
}

const MyLibraryDetailPage: React.FC = () => {
  const { id } = useParams(); // 동적 라우트 param (책 id)
  const router = useRouter();
  const [bookDetail, setBookDetail] = useState<UserBookDetail | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  // 인증 정보 가져오기: 쿠키 기반 인증 (withCredentials 사용)
  useEffect(() => {
    axios
      .get(`${API_GATEWAY_URL}/api/v1/auth/me`, { withCredentials: true })
      .then((res) => {
        setProfile({
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
        });
      })
      .catch((err) => {
        console.error("Auth error:", err);
        router.push("/login");
      });
  }, [router, API_GATEWAY_URL]);

  // 인증 정보가 준비되면, 책 상세 정보 호출
  useEffect(() => {
    if (!profile) return; // profile이 아직 로드되지 않았다면 대기
    const userId = profile.id;
    const url = `${API_GATEWAY_URL}/mylibrary-service/${userId}/book/${id}`;
    axios
      .get(url, { withCredentials: true })
      .then((res) => {
        setBookDetail(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch book detail:", err);
        setIsLoading(false);
      });
  }, [id, profile, API_GATEWAY_URL]);

  const handleDelete = async () => {
    if (!confirm("정말 이 책 기록을 삭제하시겠습니까?")) return;
    if (!profile) return;
    const userId = profile.id;
    try {
      const url = `${API_GATEWAY_URL}/mylibrary-service/${userId}/book/${id}`;
      await axios.delete(url, { withCredentials: true });
      alert("삭제되었습니다.");
      router.push("/mylibrary");
    } catch (err) {
      console.error("Delete error:", err);
      alert("삭제 실패");
    }
  };

  const handleEdit = () => {
    // 예를 들어 /mylibrary/{id}/edit 페이지로 이동
    router.push(`/mylibrary/${id}/edit`);
  };

  if (isLoading) {
    return <div className="detail-loading">Loading...</div>;
  }

  if (!bookDetail) {
    return <div>Book detail not found</div>;
  }

  return (
    <div className="mylibrary-detail-container">
      <div className="book-header">
        <div className="info-group">
          <img
            className="book-thumbnail"
            src={bookDetail.thumbnail || "/default-thumbnail.png"}
            alt={bookDetail.title}
          />
          <div className="book-info">
            <h1 className="book-title">{bookDetail.title}</h1>
            <p className="book-author">저자: {bookDetail.author}</p>
            <p className="book-publisher">출판: {bookDetail.publisher}</p>
            <p className="book-startDate">시작 날짜: {bookDetail.startDate}</p>
            <p className="book-endDate">완독 날짜: {bookDetail.endDate}</p>
          </div>
        </div>
        <div className="action-buttons">
          <button className="edit-btn" onClick={handleEdit}>
            <img src="/edit_icon.png" alt="Edit" className="action-icon" />
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            <img src="/delete_icon.png" alt="Delete" className="action-icon" />
          </button>
        </div>
      </div>
      <div className="book-record">
        <h2>나의 기록</h2>
        <p>{bookDetail.personalReview}</p>
      </div>
      <div className="book-quotes">
        <h2>나의 문장</h2>
        {bookDetail.quotes.length === 0 ? (
          <p>기록된 문장이 없습니다.</p>
        ) : (
          bookDetail.quotes.map((q) => (
            <div className="quote-item" key={q.id}>
              <span className="quote-page">p.{q.pageNumber}</span>
              <span className="quote-text">{q.quoteText}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyLibraryDetailPage;
