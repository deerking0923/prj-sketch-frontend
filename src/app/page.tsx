// src/app/page.tsx
import React from 'react';
import xml2js from 'xml2js';
import PopularLoanBooks from './components/PopularLoanBooks';
import CommunityBoard from './components/CommunityBoard';
import UserInfoWrapper from './components/UserInfoWrapper';
import RecentReviews from './components/RecentReviews'; // 새 컴포넌트 임포트
import './home.css';

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
  if (!authKey) {
    throw new Error('DATA4LIBRARY_AUTH_KEY is not defined in environment variables.');
  }

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  
  const apiUrl = `http://data4library.kr/api/loanItemSrch?authKey=${authKey}&startDt=${yesterday}&endDt=${today}&pageNo=1&pageSize=5`;
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

// 서버 컴포넌트이므로 "use client"를 제거합니다.
export default async function HomePage() {
  const books = await getBooks();

  return (
    <div className="main-container">
      <main className="content">
        <PopularLoanBooks books={books} />
        <section className="widgets">
          <CommunityBoard />
          <UserInfoWrapper />
          <RecentReviews />  {/* 최근 리뷰 컴포넌트 */}
        </section>
      </main>
    </div>
  );
}
