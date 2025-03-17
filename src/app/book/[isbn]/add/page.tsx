"use client";

import React, { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./mylibraryAdd.css";

export default function MyLibraryAddPage() {
  const router = useRouter();
  const params = useParams();            // 경로 파라미터 사용
  const searchParams = useSearchParams(); // 나머지 query string

  // ISBN은 경로 파라미터에서 가져옴.
  const isbn = params.isbn || "";
  // 나머지 정보는 query string에서 가져옴.
  const title = searchParams.get("title") || "";
  const author = searchParams.get("author") || "";
  const publisher = searchParams.get("publisher") || "";
  const thumbnail = searchParams.get("thumbnail") || "";

  // 감상문, 시작날짜, 완독날짜, 기록 문장 상태 관리
  const [personalReview, setPersonalReview] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [quotes, setQuotes] = useState([{ pageNumber: "", quoteText: "" }]);

  // 추가 문장 필드 추가
  const addQuoteField = () => {
    setQuotes([...quotes, { pageNumber: "", quoteText: "" }]);
  };

  // 문장 필드 변경 핸들러
  const handleQuoteChange = (index: number, field: "pageNumber" | "quoteText", value: string) => {
    const newQuotes = [...quotes];
    newQuotes[index][field] = value;
    setQuotes(newQuotes);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("로그인 후 이용 가능합니다.");
      router.push("/login");
      return;
    }

    const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
    const url = `${API_GATEWAY_URL}/mylibrary-service/${userId}/create`;

    try {
      const body = {
        isbn,
        title,
        author,
        publisher,
        pDate: "", // 출판일은 네이버 API에서 가져오지 않았다면 빈 문자열 처리
        thumbnail,
        personalReview,
        quotes: quotes.filter(q => q.pageNumber || q.quoteText),
        startDate: startDate ? startDate.toISOString().slice(0, 10) : "",
        endDate: endDate ? endDate.toISOString().slice(0, 10) : "",
        description: "", // 필요에 따라 책 설명을 추가
      };

      const res = await axios.post(url, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("성공:", res.data);
      alert("내 서재에 추가되었습니다.");
      router.push("/mylibrary"); // 내 서재 목록으로 이동
    } catch (err) {
      console.error(err);
      alert("추가 실패");
    }
  };

  return (
    <div className="mylibrary-add-container">
      <h1>내 서재에 기록 추가</h1>
      <form className="mylibrary-add-form" onSubmit={handleSubmit}>
        <div className="book-summary">
          <img src={thumbnail} alt={title} />
          <div>
            <p><strong>제목:</strong> {title}</p>
            <p><strong>저자:</strong> {author}</p>
            <p><strong>출판사:</strong> {publisher}</p>
            <p><strong>ISBN:</strong> {isbn}</p>
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
          내 서재에 저장
        </button>
      </form>
    </div>
  );
}
