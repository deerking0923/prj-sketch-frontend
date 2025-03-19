"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import "../style/header.css";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 경로(pathname)가 변경될 때마다 인증 상태를 다시 확인합니다.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
        // /api/v1/auth/me 엔드포인트가 JWT 토큰이 유효하면 사용자 정보를 반환하도록 구현되어 있어야 합니다.
        const response = await axios.get(`${API_GATEWAY_URL}/api/v1/auth/me`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [pathname]); // 경로가 변경될 때마다 이 effect가 재실행됩니다.

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

  const handleLogout = async () => {
    try {
      const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
      // 로그아웃 API 호출: 백엔드에서 쿠키를 클리어하도록 구현됨
      await axios.post(
        `${API_GATEWAY_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error", error);
    }
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
