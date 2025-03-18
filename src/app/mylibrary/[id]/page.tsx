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
  userId: string;
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

const MyLibraryDetailPage: React.FC = () => {
  const { id } = useParams(); // dynamic route param (book id)
  const router = useRouter();
  const [bookDetail, setBookDetail] = useState<UserBookDetail | null>(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const API_GATEWAY_URL =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  useEffect(() => {
    if (!token || !userId) {
      router.push("/login");
      return;
    }
    const url = `${API_GATEWAY_URL}/mylibrary-service/${userId}/book/${id}`;
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBookDetail(res.data))
      .catch((err) => console.error(err));
  }, [id, router, token, userId]);

  const handleDelete = async () => {
    if (!token || !userId) {
      alert("로그인 후 이용 가능합니다.");
      router.push("/login");
      return;
    }
    if (!confirm("정말 이 책 기록을 삭제하시겠습니까?")) return;

    try {
      const url = `${API_GATEWAY_URL}/mylibrary-service/${userId}/book/${id}`;
      await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      alert("삭제되었습니다.");
      router.push("/mylibrary");
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  const handleEdit = () => {
    // 수정 페이지로 이동. 예를 들어 /mylibrary/{id}/edit 페이지를 구현했다고 가정.
    router.push(`/mylibrary/${id}/edit`);
  };

  if (!bookDetail) {
    return <div className="detail-loading">Loading...</div>;
  }

  return (
    <div className="mylibrary-detail-container">
      <div className="book-header">
        <div className="info-group">
          <img
            className="book-thumbnail"
            src={bookDetail.thumbnail}
            alt={bookDetail.title}
          />
          <div className="book-info">
            <h1 className="book-title">{bookDetail.title}</h1>
            <p className="book-author">저자: {bookDetail.author}</p>
            <p className="book-publisher">출판: {bookDetail.publisher}</p>
            {/* <p className="book-pdate">
              발행일: {bookDetail.pDate ?? "정보 없음"}
            </p> */}
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
