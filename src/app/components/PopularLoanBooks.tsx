// src/components/PopularLoanBooks.tsx
import React from 'react';

interface Book {
  title: string;
  imageUrl: string;
}

interface PopularLoanBooksProps {
  books: Book[];
}
//

const PopularLoanBooks: React.FC<PopularLoanBooksProps> = ({ books }) => {
  return (
    <section className="popular-loan-books">
      <h2>인기 대출 도서</h2>
      <div className="loan-book-grid">

{books.map((book, index) => (
  <div key={index} className="loan-book-item">
    {book.imageUrl ? (
      <img src={book.imageUrl} alt={book.title} />
    ) : (
      // 또는 기본 이미지를 지정할 수도 있음
      <img src="/default-image.png" alt="기본 이미지" />
    )}
    <p>{book.title}</p>
  </div>
))}

      </div>
    </section>
  );
};

export default PopularLoanBooks;