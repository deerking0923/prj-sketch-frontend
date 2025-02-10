// src/app/page.tsx
import React from 'react';
import PopularLoanBooks from './components/PopularLoanBooks';
import CommunityBoard from './components/CommunityBoard';
import UserInfo from './components/UserInfo';
import './home.css';
import xml2js from 'xml2js';

// XML 데이터 구조 타입 정의
interface XMLDoc {
  bookname: string[];
  bookImageURL: string[];
}

interface XMLResponse {
  response: {
    docs: [
      {
        doc: XMLDoc[];
      }
    ];
  };
}

async function getBooks() {
  const authKey = process.env.DATA4LIBRARY_AUTH_KEY;
  // 오늘 날짜를 "YYYY-MM-DD" 형식으로 생성
  const today = new Date().toISOString().slice(0, 10);
  const startDt = today;
  const endDt = today;
  const pageNo = '1';
  const pageSize = '5';

  if (!authKey) {
    throw new Error('DATA4LIBRARY_AUTH_KEY is not defined in environment variables.');
  }

  const apiUrl = `http://data4library.kr/api/loanItemSrch?authKey=${authKey}&startDt=${startDt}&endDt=${endDt}&pageNo=${pageNo}&pageSize=${pageSize}`;
  const res = await fetch(apiUrl);
  const xmlData = await res.text();

  const parser = new xml2js.Parser();
  const result = (await parser.parseStringPromise(xmlData)) as XMLResponse;
  const docs = result.response.docs[0].doc || [];
  const books = docs.map((doc: XMLDoc) => ({
    title: doc.bookname[0],
    imageUrl: doc.bookImageURL[0],
  }));
  
  return books;
}


// 비동기 서버 컴포넌트로 페이지 렌더링 해보잣...
export default async function HomePage() {
  const books = await getBooks();

  return (
    <div className="main-container">
      <main className="content">
        {/* 인기 대출 도서 섹션 */}
        <PopularLoanBooks books={books} />

        {/* 커뮤니티 게시판과 사용자 정보 섹션을 widgets 컨테이너로 묶기 */}
        <section className="widgets">
          <CommunityBoard />
          <UserInfo />
        </section>
      </main>
    </div>
  );
  
}
