'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import '../style/header.css';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery !== '') {
      // /book/search 페이지로 이동하면서 query 파라미터 전달
      router.push(`/book/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <header className="header">
      <div className="logo">로고</div>
      {pathname === '/' ? (
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="검색바"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            검색
          </button>
        </div>
      ) : (
        <Link href="/">
          <div className="alt-text" style={{ cursor: 'pointer' }}>다독다독</div>
        </Link>
      )}
      <div className="auth-buttons">
        <Link href="/login" legacyBehavior>
          <a className="login-button">로그인</a>
        </Link>
        <Link href="/signup" legacyBehavior>
          <a className="signup-button">회원가입</a>
        </Link>
      </div>
    </header>
  );
};

export default Header;
