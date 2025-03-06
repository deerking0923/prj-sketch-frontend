"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./style/CommunityBoard.module.css";

interface Post {
  id: number;
  title: string;
  author: string;
  viewCount: number;
  createdAt: string; // API에서 반환하는 필드명과 일치
}

export default function CommunityBoardWidget() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const API_GATEWAY_URL = "http://127.0.0.1:8000";

  const fetchPosts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get<Post[]>(`${API_GATEWAY_URL}/community-service/posts`);
      // 내림차순 정렬: 최신 게시글이 위로 오도록 정렬한 후 최근 5건만 선택
      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>커뮤니티 게시판</h1>
        <button className={styles.gotoButton} onClick={handleGotoList}>
          게시판 전체보기
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
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
