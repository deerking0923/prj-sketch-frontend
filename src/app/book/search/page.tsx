"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "./search.css";
import Link from "next/link";

interface SearchResult {
  image: string;
  title: string;
  author: string;
  isbn: string; // ISBN 필드 추가
}

const BookSearchPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  // 입력 필드의 값
  const [query, setQuery] = useState(initialQuery);
  // 실제 API 호출에 사용할 현재 검색어
  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const display = 10; // 한 페이지당 표시할 결과 수
  const [total, setTotal] = useState(0);

  const fetchResults = async (q: string, page: number) => {
    setLoading(true);
    setError("");
    try {
      // 네이버 API는 start가 1부터 시작하므로:
      const start = (page - 1) * display + 1;
      const response = await fetch(
        `/api/naver-book-search?query=${encodeURIComponent(
          q
        )}&start=${start}&display=${display}`
      );
      if (!response.ok) {
        throw new Error("API 요청에 실패했습니다.");
      }
      const data = await response.json();
      // API 응답에서 total과 items 필드를 사용 (네이버 API 기준)
      setTotal(data.total || 0);
      setResults(data.items || []);
    } catch (err: unknown) {
      setError((err as Error).message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // currentQuery와 currentPage를 기준으로 결과를 가져옴
  useEffect(() => {
    if (currentQuery) {
      fetchResults(currentQuery, currentPage);
    }
  }, [currentQuery, currentPage]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      // 새 검색 시 currentQuery를 업데이트하고 페이지를 1로 초기화
      setCurrentQuery(query);
      setCurrentPage(1);
      fetchResults(query, 1);
    }
  };

  const totalPages = Math.ceil(total / display) || 1;
  const currentGroup = Math.floor((currentPage - 1) / 10);
  const startPage = currentGroup * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);

  return (
    <div className="book-search-container">
      <h1>도서 검색</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          검색
        </button>
      </form>
      {loading && <p>검색 중...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && results.length === 0 && query && (
        <p className="no-results-message">검색 결과가 없습니다.</p>
      )}
      <div className="results">
        {results.map((item, index) => (
          <div key={index} className="result-item">
            <img src={item.image} alt={item.title} className="result-image" />
            <div className="result-details">
              {/* 제목을 클릭하면 /book/{isbn}으로 이동 */}
              <Link href={`/book/${item.isbn}`}>
                <h3 className="result-title">{item.title}</h3>
              </Link>
              <p className="result-author">{item.author}</p>
            </div>
          </div>
        ))}
      </div>
      {results.length > 0 && totalPages > 1 && (
        <div className="pagination">
          {startPage > 1 && (
            <button
              onClick={() => setCurrentPage(startPage - 1)}
              className="pagination-button"
            >
              이전
            </button>
          )}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`pagination-button ${
                pageNumber === currentPage ? "active" : ""
              }`}
            >
              {pageNumber}
            </button>
          ))}
          {endPage < totalPages && (
            <button
              onClick={() => setCurrentPage(endPage + 1)}
              className="pagination-button"
            >
              다음
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const BookSearchPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading search page...</div>}>
      <BookSearchPageContent />
    </Suspense>
  );
};

export default BookSearchPage;
