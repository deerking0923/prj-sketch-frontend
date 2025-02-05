// src/app/page.tsx 또는 원하는 경로에 Home.tsx로 저장
import React, { JSX } from 'react';
import Link from 'next/link';
import './home.css';

export default function Home(): JSX.Element {
  return (
    <div className="container">
      <h1 className="title">환영합니다.</h1>
      <Link href="/slides" legacyBehavior>
        <a className="slide-button">슬라이드 보기</a>
      </Link>
    </div>
  );
}
