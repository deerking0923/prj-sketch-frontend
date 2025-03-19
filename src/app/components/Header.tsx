"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "../style/header.css";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery !== "") {
      router.push(`/book/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleMyLibraryClick = () => {
    router.push("/mylibrary");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="header">
      <Link href="/">
        <img src="/logo02.png" alt="로고" className="logo" />
      </Link>

      {pathname === "/" && (
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-bar"
            placeholder="검색어를 입력하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            검색
          </button>
        </form>
      )}

      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="auth-logged-in">
            <img
              src="/userinfo.png"
              alt="내 정보"
              className="userinfo-icon"
              onClick={handleMyLibraryClick}
              style={{ cursor: "pointer", marginRight: "10px" }}
            />
            <button onClick={handleLogout} className="logout-button">
              로그아웃
            </button>
          </div>
        ) : (
          <>
            <Link href="/login" legacyBehavior>
              <a className="login-button">로그인</a>
            </Link>
            <Link href="/signup" legacyBehavior>
              <a className="signup-button">회원가입</a>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;