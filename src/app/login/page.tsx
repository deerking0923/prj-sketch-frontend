"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./login.css";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 백엔드의 로그인 API 호출 (/login)
      const response = await axios.post("/login", { email, password });
      // 응답 헤더에서 JWT 토큰과 사용자 ID 추출
      const token = response.headers["token"];
      const userId = response.headers["userid"];
      if (token && userId) {
        // 클라이언트 측 저장 (localStorage 또는 쿠키)
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        // 로그인 성공 후 메인 페이지로 이동
        router.push("/");
      } else {
        setError("로그인 정보가 올바르지 않습니다.");
      }
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data || "로그인에 실패했습니다.");
        } else {
          setError("로그인에 실패했습니다.");
        }
      }
      
  };

  return (
    <div className="login-container">
      <h1>로그인</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <button type="submit" className="login-button">로그인</button>
      </form>
    </div>
  );
};

export default LoginPage;
