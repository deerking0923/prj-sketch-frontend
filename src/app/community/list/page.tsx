"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import styles from "./CommunityBoardPage.module.css";

// 백엔드의 QuestionResponse에 맞춘 타입 정의
interface Post {
  id: number;
  subject: string;
  authorUsername: string;
  viewCount: number;
  createdDate: string;
}

// 백엔드가 반환하는 PageResponse 형식 (Spring Data의 Page 객체 형태)
interface PageResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  number: number; // 현재 페이지 (0-indexed)
}

export default function CommunityBoardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  const fetchPosts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${API_GATEWAY_URL}/api/v1/questions?page=${currentPage}`,
        { withCredentials: true }
      );
      // 백엔드에서 ApiResponse 형태로 반환 (data.data: PageResponse)
      const data: PageResponse = response.data.data;
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      console.error(err);
      setError("게시글 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const handlePrevPage = (): void => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = (): void => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePostClick = (postId: number): void => {
    router.push(`/community/posts/${postId}`);
  };

  // 게시글 작성 페이지로 이동하는 핸들러
  const handlePostCreate = (): void => {
    router.push("/community/posts/create");
  };

  const formatDate = (date: string): string => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  return (
    <div className={styles.container}>
      <h1>커뮤니티 게시판</h1>
      {/* 오른쪽 상단에 게시글 작성 버튼 */}
      <div className={styles.createButtonWrapper}>
        <button onClick={handlePostCreate} className={styles.createButton}>
          게시글 작성
        </button>
      </div>
      {loading && <p>게시글 로딩 중...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && posts.length === 0 && <p>게시글이 없습니다.</p>}
      <div className={styles.postList}>
        {posts.map((post) => (
          <div
            key={post.id}
            className={styles.postCard}
            onClick={() => handlePostClick(post.id)}
          >
            <h3>{post.subject}</h3>
            <div className={styles.metaInfo}>
              <span>작성자: {post.authorUsername}</span>
              <span>{formatDate(post.createdDate)}</span>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={styles.pageButton}
          >
            이전
          </button>
          <span>
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className={styles.pageButton}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
