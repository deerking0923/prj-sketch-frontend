'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import './search.css';

interface SearchResult {
  image: string;
  title: string;
  author: string;
}

const BookSearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchResults = async (q: string) => {
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const response = await fetch(`/api/naver-book-search?query=${encodeURIComponent(q)}`);
      if (!response.ok) {
        throw new Error('API 요청에 실패했습니다.');
      }
      const data = await response.json();
      // data.items에 SearchResult 형식의 결과가 담겨 있다고 가정합니다.
      setResults(data.items || []);
    } catch (err: unknown) {
      setError((err as Error).message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드시 URL query가 있다면 자동 검색 실행
  useEffect(() => {
    if (initialQuery) {
      fetchResults(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      fetchResults(query);
    }
  };

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
        <button type="submit" className="search-button">검색</button>
      </form>
      {loading && <p>검색 중...</p>}
      {error && <p className="error-message">{error}</p>}
      {(!loading && results.length === 0 && query) && (
        <p className="no-results-message">검색 결과가 없습니다.</p>
      )}
      <div className="results">
        {results.map((item, index) => (
          <div key={index} className="result-item">
            <img src={item.image} alt={item.title} className="result-image" />
            <div className="result-details">
              <h3 className="result-title">{item.title}</h3>
              <p className="result-author">{item.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSearchPage;
