'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import '../style/header.css';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // 메인 페이지로 돌아가면 검색어를 초기화
  useEffect(() => {
    if (pathname === '/') {
      setSearchQuery('');
    }
  }, [pathname]);

  // form 제출 시 (엔터키 포함) 검색 실행
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery !== '') {
      router.push(`/book/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <header className="header">
      <div className="logo">로고</div>
      {pathname === '/' ? (
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-bar"
            placeholder="검색바"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            검색
          </button>
        </form>
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
