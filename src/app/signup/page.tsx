"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./SignUpPage.module.css";

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>(""); // 'name' 대신 'username'
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
      // 백엔드의 AuthController에 맞춘 엔드포인트
      const response = await axios.post(
        `${API_GATEWAY_URL}/api/v1/auth/signup`,
        {
          username,
          password,
          email,
        }
      );

      if (response.status === 201) {
        router.push("/login");
      } else {
        setError("회원가입에 실패했습니다.");
      }
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError("회원가입에 실패했습니다.");
      } else {
        setError("회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <div className={styles.signUpContainer}>
      <h1>회원가입</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSignUp}>
        <div className={styles.formGroup}>
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
        <div className={styles.formGroup}>
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
        <div className={styles.formGroup}>
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
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
        </div>
        <button type="submit" className={styles.signUpButton}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
