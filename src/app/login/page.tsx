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
      // 환경 변수에서 API URL을 불러옵니다. (클라이언트 코드에서는 NEXT_PUBLIC_ 접두사가 필요합니다.)
      const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

      // 로그인 API 호출: user-service의 로그인 엔드포인트
      const response = await axios.post(
        `${API_GATEWAY_URL}/user-service/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // CORS 설정과 쿠키 포함을 위해 추가
        }
      );

      // 응답 헤더 확인
      console.log(response.headers); // 전체 헤더 출력

      // 응답 헤더에서 JWT 토큰과 사용자 ID 추출 (백엔드에서 발급)
      const token = response.headers["token"];
      const userId = response.headers["userid"];

      // 콘솔에 토큰과 사용자 ID 출력
      console.log("Token:", token); // 토큰 확인
      console.log("User ID:", userId); // 사용자 ID 확인

      if (token && userId) {
        // JWT 토큰과 사용자 ID를 localStorage에 저장
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        // 로그인 성공 후 메인 페이지로 이동
        router.push("/");
      } else {
        setError("로그인 정보가 일치하지 않습니다.");
      }
    } catch (err: unknown) {
      // Axios 에러 체크 및 에러 메시지 문자열화 처리
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
        <button type="submit" className="login-button">
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
