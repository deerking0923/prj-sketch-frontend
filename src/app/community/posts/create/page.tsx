"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./CommunityPostCreate.module.css";

export default function CommunityPostCreate() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  // 현재 로그인한 사용자 정보 가져오기
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/api/v1/auth/me`, { withCredentials: true });
      if (response.data && response.data.id) {
        setCurrentUserId(response.data.id);
      } else {
        setCurrentUserId(null);
      }
    } catch (err) {
      console.error("현재 사용자 정보를 가져오지 못했습니다.", err);
      setCurrentUserId(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }
    if (!currentUserId) {
      setError("로그인이 필요합니다.");
      return;
    }
    try {
      await axios.post(
        `${API_GATEWAY_URL}/api/v1/questions`,
        { subject, content, userId: currentUserId },
        { withCredentials: true }
      );
      router.push("/community/list");
    } catch (err) {
      console.error(err);
      setError("게시글 작성에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>게시글 작성</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="subject">제목</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>
          작성 완료
        </button>
      </form>
    </div>
  );
}
