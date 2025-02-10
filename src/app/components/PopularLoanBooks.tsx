// src/components/PopularLoanBooks.tsx
import React from 'react';

interface Book {
  title: string;
  imageUrl: string;
}

interface PopularLoanBooksProps {
  books: Book[];
}

const PopularLoanBooks: React.FC<PopularLoanBooksProps> = ({ books }) => {
  return (
    <section className="popular-loan-books">
      <h2>인기 대출 도서</h2>
      <div className="loan-book-grid">
        {books.map((book, index) => (
          <div key={index} className="loan-book-item">
            <img src={book.imageUrl} alt={book.title} />
            <p>{book.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularLoanBooks;
