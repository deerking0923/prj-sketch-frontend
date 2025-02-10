'use client';
import React, { useState } from 'react';
import './search.css';

// 네이버 API 도서 검색 결과에 대한 타입 정의 (예시)
interface SearchResult {
  image: string;
  title: string;
  author: string;
}

const BookSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const response = await fetch(`/api/naver-book-search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('API 요청에 실패했습니다.');
      }
      const data = await response.json();
      // data.items에 SearchResult 형식의 결과가 담겨 있다고 가정합니다.
      setResults(data.items || []);
    } catch (err: unknown) {
      // err를 Error 타입으로 단언하여 메시지를 가져옵니다.
      setError((err as Error).message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
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
