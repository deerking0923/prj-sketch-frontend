"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./edit.css"; // 스타일은 추가 페이지와 동일하게 사용

interface BookQuoteDto {
  id?: number;
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

export default function MyLibraryEditPage() {
  const { id } = useParams(); // bookId from path
  const router = useRouter();
  const [bookDetail, setBookDetail] = useState<UserBookDetail | null>(null);
  const [personalReview, setPersonalReview] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [quotes, setQuotes] = useState<BookQuoteDto[]>([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000";

  useEffect(() => {
    if (!token || !userId) {
      router.push("/login");
      return;
    }
    // GET 기존 책 기록 상세 정보
    const url = `${API_GATEWAY_URL}/mylibrary-service/${userId}/book/${id}`;
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setBookDetail(res.data);
        setPersonalReview(res.data.personalReview);
        setStartDate(res.data.startDate ? new Date(res.data.startDate) : null);
        setEndDate(res.data.endDate ? new Date(res.data.endDate) : null);
        setQuotes(res.data.quotes || []);
      })
      .catch((err) => console.error(err));
  }, [id, router, token, userId]);

  const addQuoteField = () => {
    setQuotes([...quotes, { pageNumber: "", quoteText: "" }]);
  };

  const handleQuoteChange = (index: number, field: "pageNumber" | "quoteText", value: string) => {
    const newQuotes = [...quotes];
    newQuotes[index][field] = value;
    setQuotes(newQuotes);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !userId || !bookDetail) {
      alert("로그인 후 이용 가능합니다.");
      router.push("/login");
      return;
    }

    const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000";
    // 수정 API: PUT /mylibrary-service/{userId}/book/{bookId}
    const url = `${API_GATEWAY_URL}/mylibrary-service/${userId}/book/${bookDetail.id}`;

    try {
      const body = {
        isbn: bookDetail.isbn,
        title: bookDetail.title,
        author: bookDetail.author,
        publisher: bookDetail.publisher,
        pDate: bookDetail.pDate || "",
        thumbnail: bookDetail.thumbnail,
        description: bookDetail.description,
        personalReview,
        quotes: quotes.filter(q => q.pageNumber || q.quoteText),
        startDate: startDate ? startDate.toISOString().slice(0, 10) : "",
        endDate: endDate ? endDate.toISOString().slice(0, 10) : ""
      };

      const res = await axios.put(url, body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("수정 성공:", res.data);
      alert("수정되었습니다.");
      router.push("/mylibrary");
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  if (!bookDetail) {
    return <div className="detail-loading">Loading...</div>;
  }

  return (
    <div className="mylibrary-add-container">
      <h1>내 서재 기록 수정</h1>
      <form className="mylibrary-add-form" onSubmit={handleSubmit}>
        <div className="book-summary">
          <img src={bookDetail.thumbnail} alt={bookDetail.title} />
          <div>
            <p><strong>제목:</strong> {bookDetail.title}</p>
            <p><strong>저자:</strong> {bookDetail.author}</p>
            <p><strong>출판사:</strong> {bookDetail.publisher}</p>
            <p><strong>ISBN:</strong> {bookDetail.isbn}</p>
          </div>
        </div>

        <label>감상문</label>
        <textarea
          value={personalReview}
          onChange={(e) => setPersonalReview(e.target.value)}
          rows={4}
        />

        <label>시작 날짜</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="YYYY-MM-DD"
        />

        <label>완독 날짜</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="YYYY-MM-DD"
        />

        <h2>기록 문장</h2>
        {quotes.map((q, index) => (
          <div key={index} className="quote-input-row">
            <input
              type="text"
              placeholder="페이지 번호"
              value={q.pageNumber}
              onChange={(e) => handleQuoteChange(index, "pageNumber", e.target.value)}
            />
            <input
              type="text"
              placeholder="기억에 남는 문장"
              value={q.quoteText}
              onChange={(e) => handleQuoteChange(index, "quoteText", e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={addQuoteField} className="add-quote-btn">
          + 문장 추가
        </button>

        <button type="submit" className="submit-btn">
          수정 내용 저장
        </button>
      </form>
    </div>
  );
}
