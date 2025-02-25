import React from "react";
import LibraryAddButton from "../../components/LibraryAddButton"; // 경로 주의: app/book/[isbn]에서 components로 접근
import BookReviewSection from "../../components/BookReviewSection"; // 리뷰 섹션 컴포넌트 추가
import "./bookDetail.css";

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
  const { isbn } = await params;

  const res = await fetch(
    `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(
      isbn
    )}&display=1`,
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID || "",
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET || "",
      },
    }
  );

  if (!res.ok) {
    return (
      <div>
        API 요청 실패: {res.status} {res.statusText}
      </div>
    );
  }

  const data = await res.json();
  const book: BookDetail | undefined = data.items && data.items[0];
  if (!book) {
    return <div>해당 도서를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="book-detail-container">
      {/* 상단 영역: 로그인한 경우에만 LibraryAddButton이 렌더링됨 */}
      <div className="detail-topbar">
        <LibraryAddButton
          isbn={isbn}
          title={book.title}
          author={book.author}
          publisher={book.publisher}
          thumbnail={book.image}
        />
      </div>

      {/* 책 상세 정보 영역 */}
      <div className="book-detail">
        <div className="book-image">
          <img src={book.image} alt={book.title} />
        </div>
        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">
            <strong>저자:</strong> {book.author}
          </p>
          <p className="book-publisher">
            <strong>출판사:</strong> {book.publisher}
          </p>
          <p className="book-isbn">
            <strong>ISBN:</strong> {isbn}
          </p>
          <p className="book-pubdate">
            <strong>출판일:</strong> {book.pubdate}
          </p>
          <div className="book-description">
            <strong>설명:</strong>
            <p>{book.description}</p>
          </div>
        </div>
      </div>

      {/* 리뷰 섹션 추가 */}
      <BookReviewSection isbn={isbn} />
    </div>
  );
}
