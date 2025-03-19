"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./login.css";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");  // 이메일 대신 username으로 변경
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
      await axios.post(
        `${API_GATEWAY_URL}/api/v1/auth/login`, // 엔드포인트 경로 확인
        { username, password },                // username과 password 전송
        { withCredentials: true }
      );
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError("로그인 정보가 일치하지 않습니다.");
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
          <label htmlFor="username">사용자명</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="사용자명을 입력하세요"
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
        <button type="submit" className="login-button">
          로그인
        </button>
      </form>

    </div>
  );
};

export default LoginPage;
