"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";  // 로그아웃 버튼 컴포넌트 임포트
import "../style/header.css";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (pathname === "/") {
      setSearchQuery("");
    }
    // localStorage가 브라우저에서만 존재하므로 체크
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

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

  return (
    <header className="header">
      {/* <div className="logo">로고</div> */}
      {pathname === "/" ? (
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
      ) : (
        <Link href="/">
          <div className="alt-text" style={{ cursor: "pointer" }}>
            다독다독
          </div>
        </Link>
      )}
      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="auth-logged-in">
            <img
              src="/userinfo.png"
              alt="내 정보"
              className="userinfo-icon"
              onClick={handleMyLibraryClick}
              style={{ cursor: "pointer", marginRight: "10px" }}  // 클릭 시 /mylibrary로 이동
            />
            <LogoutButton />
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
