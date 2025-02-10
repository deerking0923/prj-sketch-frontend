import React from 'react';
import Link from 'next/link';
//import './header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">로고</div>
      <input type="text" className="search-bar" placeholder="검색바" />
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
