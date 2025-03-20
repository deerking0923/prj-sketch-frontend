"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import styles from "./CommunityPostEdit.module.css";

interface Post {
  id: number;
  subject: string;
  content: string;
}

export default function CommunityPostEdit() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  // 기존 게시글 데이터를 불러오는 함수
  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_GATEWAY_URL}/api/v1/questions/${id}`, {
        withCredentials: true,
      });
      const post: Post = response.data.data;
      setSubject(post.subject);
      setContent(post.content);
    } catch (err) {
      console.error(err);
      setError("게시글 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }
    try {
      await axios.put(
        `${API_GATEWAY_URL}/api/v1/questions/${id}`,
        { subject, content },
        { withCredentials: true }
      );
      router.push(`/community/posts/${id}`);
    } catch (err) {
      console.error(err);
      setError("게시글 수정에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>게시글 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>게시글 수정</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.label}>제목</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>수정 완료</button>
      </form>
    </div>
  );
}
