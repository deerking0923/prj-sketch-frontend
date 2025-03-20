"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./mylibraryAdd.css";

interface AuthResponse {
  id: number;
  username: string;
  email: string;
}

export interface RequestUserBook {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  pDate: string;
  description: string;
  thumbnail: string;
  personalReview: string;
  quotes: { pageNumber: string; quoteText: string }[];
  startDate: string;
  endDate: string;
}

export default function MyLibraryAddPage() {
  const router = useRouter();
  const params = useParams();            // 경로 파라미터 사용
  const searchParams = useSearchParams(); // query string 사용

  const isbnParam = params.isbn;
  const isbn = Array.isArray(isbnParam) ? isbnParam[0] : isbnParam || "";
  
  // 나머지 정보는 query string에서 가져옴.
  const title = searchParams.get("title") || "";
  const author = searchParams.get("author") || "";
  const publisher = searchParams.get("publisher") || "";
  const thumbnail = searchParams.get("thumbnail") || "";

  // 백엔드 인증 응답을 통해 받아올 현재 사용자 정보
  const [authInfo, setAuthInfo] = useState<AuthResponse | null>(null);

  // 감상문, 시작 날짜, 완독 날짜, 기록 문장 상태 관리
  const [personalReview, setPersonalReview] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [quotes, setQuotes] = useState([{ pageNumber: "", quoteText: "" }]);

  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  useEffect(() => {
    // 백엔드에 인증 요청: 쿠키에 httpOnly로 저장된 토큰이 자동 전송됩니다.
    axios
      .get(`${API_GATEWAY_URL}/api/v1/auth/me`, { withCredentials: true })
      .then((res) => {
        // 응답 구조가 { id, username, email }로 가정
        setAuthInfo({
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
        router.push("/login");
      });
  }, [router, API_GATEWAY_URL]);

  const addQuoteField = () => {
    setQuotes([...quotes, { pageNumber: "", quoteText: "" }]);
  };

  const handleQuoteChange = (
    index: number,
    field: "pageNumber" | "quoteText",
    value: string
  ) => {
    const newQuotes = [...quotes];
    newQuotes[index][field] = value;
    setQuotes(newQuotes);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authInfo) {
      alert("인증 정보가 없습니다. 다시 로그인해주세요.");
      router.push("/login");
      return;
    }
    if (!title || !author || !publisher || !isbn) {
      alert("필수 책 정보를 확인해주세요.");
      return;
    }
    const userId = authInfo.id;
    const url = `${API_GATEWAY_URL}/mylibrary-service/${userId}/create`;

    const body: RequestUserBook = {
      isbn,
      title,
      author,
      publisher,
      pDate: "", // 출판일 정보가 없으면 빈 문자열 처리
      thumbnail,
      personalReview,
      quotes: quotes.filter(q => q.pageNumber || q.quoteText),
      startDate: startDate ? startDate.toISOString().slice(0, 10) : "",
      endDate: endDate ? endDate.toISOString().slice(0, 10) : "",
      description: "", // 책 설명 (필요 시 추가)
    };

    try {
      const res = await axios.post(url, body, { withCredentials: true });
      console.log("성공:", res.data);
      alert("내 서재에 추가되었습니다.");
      router.push("/mylibrary");
    } catch (err) {
      console.error(err);
      alert("추가 실패");
    }
  };

  // 인증 정보가 아직 로드되지 않았다면 로딩 처리
  if (!authInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mylibrary-add-container">
      <h1>내 서재에 기록 추가</h1>
      <form className="mylibrary-add-form" onSubmit={handleSubmit}>
        <div className="book-summary">
          <img src={thumbnail} alt={title} />
          <div>
            <p>
              <strong>제목:</strong> {title}
            </p>
            <p>
              <strong>저자:</strong> {author}
            </p>
            <p>
              <strong>출판사:</strong> {publisher}
            </p>
            <p>
              <strong>ISBN:</strong> {isbn}
            </p>
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
