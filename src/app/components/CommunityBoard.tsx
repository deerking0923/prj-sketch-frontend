"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import styles from "./style/CommunityBoard.module.css"; // 기존 스타일 그대로 사용

// 백엔드 QuestionResponse에 맞는 타입 정의
interface Post {
  id: number;
  subject: string;         // 게시글 제목
  authorUsername: string;  // 작성자
  viewCount: number;
  createdDate: string;
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
      // 백엔드의 질문 목록 조회 엔드포인트 (페이지네이션: page=0)
      const response = await axios.get(`${API_GATEWAY_URL}/api/v1/questions?page=0`);
      // ApiResponse 형태: { data: { content: [ ... ], ... } }
      const postsArray: Post[] = response.data.data.content;
      
      // 최신 게시글이 위로 오도록 내림차순 정렬 후 최근 5건 선택
      const sortedPosts = postsArray.sort(
        (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
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
            <h3>{post.subject}</h3>
            <div className={styles.metaInfo}>
              <span>작성자: {post.authorUsername}</span>
              <span>{formatDate(post.createdDate)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
