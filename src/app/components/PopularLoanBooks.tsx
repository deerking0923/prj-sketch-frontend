import React from 'react';
import Link from 'next/link';
import style from './style/PopularLoanBooks.module.css'; // CSS 모듈을 import

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
    <section className={style['popular-loan-books']}> {/* CSS 모듈 클래스 이름 적용 */}
      <h2>인기 대출 도서</h2>
      <div className={style['loan-book-grid']}> {/* CSS 모듈 클래스 이름 적용 */}
        {books.map((book, index) => (
          <div key={index} className={style['loan-book-item']}> {/* CSS 모듈 클래스 이름 적용 */}
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
