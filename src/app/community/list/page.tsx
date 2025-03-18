"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import styles from "./CommunityBoardPage.module.css";

interface Post {
  id: number;
  title: string;
  author: string;
  viewCount: number;
  createDate: string; // API에서 반환되는 필드명 (createDate로 통일)
}

export default function CommunityBoardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 10;

  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  const fetchPosts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get<Post[]>(`${API_GATEWAY_URL}/community-service/posts`);
      // 내림차순 정렬: 최신 게시글이 위로 오도록 정렬
      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      );
      setPosts(sortedPosts);
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

  // 페이지네이션 계산
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPosts = posts.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePrevPage = (): void => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = (): void => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePostClick = (postId: number): void => {
    router.push(`/community/posts/${postId}`);
  };

  return (
    <div className={styles.container}>
      <h1>커뮤니티 게시판</h1>
      {loading && <p>게시글 로딩 중...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && totalPosts === 0 && <p>게시글이 없습니다.</p>}
      <div className={styles.postList}>
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className={styles.postCard}
            onClick={() => handlePostClick(post.id)}
          >
            <h3>{post.title}</h3>
            <div className={styles.metaInfo}>
              <span>작성자: {post.author}</span>

              <span>
                {format(new Date(post.createDate), "yyyy-MM-dd'T'HH:mm:ss")}
              </span>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
