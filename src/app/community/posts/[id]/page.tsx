"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import styles from "./CommunityPostDetail.module.css";
import PostCommentSection from "../../../components/PostCommentSection";

interface Post {
  id: number;
  userId: string;
  author: string;
  title: string;
  content: string;
  createDate: string; // API에서 반환되는 필드명 (createDate로 통일)
  viewCount: number;
  // comments는 PostCommentSection에서 별도로 처리하므로 여기선 생략 가능
}

export default function CommunityPostDetail() {
  const { id } = useParams() as { id: string };
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get<Post>(
        `${API_GATEWAY_URL}/community-service/posts/${id}`
      );
      setPost(response.data);
    } catch (err: unknown) {
      console.error(err);
      setError("게시글 상세 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>상세정보 로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.container}>
        <p>게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.meta}>
        <span>작성자: {post.author}</span>

        <span>{format(new Date(post.createDate), "yyyy-MM-dd'T'HH:mm:ss")}</span>
      </div>
      <div className={styles.content}>
        <p>{post.content}</p>
      </div>

      {/* 댓글 섹션은 별도의 PostCommentSection 컴포넌트에서 처리 */}
      <PostCommentSection postId={post.id} />
    </div>
  );
}
