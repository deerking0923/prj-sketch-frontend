"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import "./mylibraryDetail.css"; // CSS 파일 import

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
  const { id } = useParams(); // dynamic route param
  const router = useRouter();
  const [bookDetail, setBookDetail] = useState<UserBookDetail | null>(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // API 게이트웨이 URL
  const API_GATEWAY_URL =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000";

  useEffect(() => {
    if (!token || !userId) {
      router.push("/login");
      return;
    }

    // GET /mylibrary-service/{userId}/book/{id}
    const url = `${API_GATEWAY_URL}/mylibrary-service/${userId}/book/${id}`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookDetail(res.data))
      .catch((err) => console.error(err));
  }, [id, router, token, userId]);

  if (!bookDetail) {
    return <div className="detail-loading">Loading...</div>;
  }

  return (
    <div className="mylibrary-detail-container">
      <div className="book-header">
        <img
          className="book-thumbnail"
          src={bookDetail.thumbnail}
          alt={bookDetail.title}
        />
        <div className="book-info">
          <h1 className="book-title">{bookDetail.title}</h1>
          <p className="book-author">저자: {bookDetail.author}</p>
          <p className="book-publisher">출판: {bookDetail.publisher}</p>
          <p className="book-pdate">
            발행일: {bookDetail.pDate ?? "정보 없음"}
          </p>
          <p className="book-startDate">시작 날짜: {bookDetail.startDate}</p>
          <p className="book-endDate">완독 날짜: {bookDetail.endDate}</p>
        </div>
      </div>
      {/* <div className="book-description">
        <h2>책 소개</h2>
        <p>{bookDetail.description}</p>
      </div> */}
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
