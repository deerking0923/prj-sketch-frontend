"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import styles from "./style/CommunityBoard.module.css"; // CSS 모듈을 import

interface Post {
  id: number;
  title: string;
  author: string;
  viewCount: number;
  createDate: string; // API에서 반환하는 필드명 ("createDate"로 통일)
}

export default function CommunityBoardWidget() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  const fetchPosts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get<Post[]>(`${API_GATEWAY_URL}/community-service/posts`);
      // 내림차순 정렬: 최신 게시글이 위로 오도록 정렬한 후 최근 5건만 선택
      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      );
      setPosts(sortedPosts.slice(0, 5));
    } catch (err: unknown) {
      console.error(err);
      setError("게시글 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (postId: number): void => {
    router.push(`/community/posts/${postId}`);
  };

  const handleGotoList = (): void => {
    router.push("/community/list");
  };

  // 날짜 포맷: yyyy-MM-dd (T자 제거)
  const formatDate = (date: string): string => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>커뮤니티 게시판</h1>
        <button className={styles.gotoButton} onClick={handleGotoList}>
          <img src="/arrow.png" alt="게시판 전체보기" className={styles.arrowIcon} />
        </button>
      </div>
      {loading && <p>게시글 로딩 중...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && posts.length === 0 && <p>게시글이 없습니다.</p>}
      <div className={styles.postList}>
        {posts.map((post) => (
          <div key={post.id} className={styles.postCard} onClick={() => handlePostClick(post.id)}>
            <h3>{post.title}</h3>
            <div className={styles.metaInfo}>
              <span>작성자: {post.author}</span>
              <span>조회수: {post.viewCount}</span>
              <span>{formatDate(post.createDate)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
