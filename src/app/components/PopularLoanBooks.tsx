import React from 'react';
import Link from 'next/link';

interface Book {
  title: string;
  imageUrl: string;
  isbn: string; // ISBN 속성 추가
}

interface PopularLoanBooksProps {
  books: Book[]; // books 배열은 Book[] 형식이어야 합니다.
}

const PopularLoanBooks: React.FC<PopularLoanBooksProps> = ({ books }) => {
  return (
    <section className="popular-loan-books">
      <h2>인기 대출 도서</h2>
      <div className="loan-book-grid">
        {books.map((book, index) => (
          <div key={index} className="loan-book-item">
            <Link href={`/book/${book.isbn}`}>
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.title} />
              ) : (
                <img src="/default-image.png" alt="기본 이미지" />
              )}
            </Link>
            <p>
              <Link href={`/book/${book.isbn}`}>{book.title}</Link>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularLoanBooks;
