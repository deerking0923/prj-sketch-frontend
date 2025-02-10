// src/app/book/[isbn]/page.tsx
import React from 'react';
import './bookDetail.css';

interface BookDetail {
  title: string;
  image: string;
  author: string;
  publisher: string;
  isbn: string;
  description: string;
  pubdate: string;
}

interface PageProps {
  params: Promise<{ isbn: string }>;
}

export default async function BookDetailPage({ params }: PageProps) {
  // 비동기적으로 params를 처리합니다.
  const { isbn } = await params;

  // 네이버 책 API를 ISBN을 검색어로 사용하여 상세 정보를 가져옵니다.
  const res = await fetch(
    `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(isbn)}&display=1`,
    {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID!,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET!,
      },
    }
  );
  const data = await res.json();

  // 첫 번째 결과를 사용 (검색 결과가 없으면 에러 처리)
  const book: BookDetail | undefined = data.items && data.items[0];
  if (!book) {
    return <div>해당 도서를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="book-detail-container">
      <div className="book-detail">
        <div className="book-image">
          <img src={book.image} alt={book.title} />
        </div>
        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author"><strong>저자:</strong> {book.author}</p>
          <p className="book-publisher"><strong>출판사:</strong> {book.publisher}</p>
          <p className="book-isbn"><strong>ISBN:</strong> {book.isbn}</p>
          <p className="book-pubdate"><strong>출판일:</strong> {book.pubdate}</p>
          <div className="book-description">
            <strong>설명:</strong>
            <p>{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
