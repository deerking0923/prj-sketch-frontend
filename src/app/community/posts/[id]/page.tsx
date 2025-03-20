"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { parse, format } from "date-fns";
import styles from "./CommunityPostDetail.module.css";
import PostCommentSection, {
  Comment,
} from "../../../components/PostCommentSection";

interface Post {
  id: number;
  subject: string;
  authorUsername: string;
  content: string;
  createdDate: string;
  viewCount: number;
  answers: Comment[]; // 댓글 목록
}

export default function CommunityPostDetail() {
  const { id } = useParams() as { id: string };
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // 현재 로그인한 사용자 정보 상태
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const router = useRouter();

  // 게시글 정보 가져오기
  const fetchPost = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${API_GATEWAY_URL}/api/v1/questions/${id}`,
        {
          withCredentials: true,
        }
      );
      // 실제 데이터는 response.data.data에 있음
      setPost(response.data.data);
    } catch (err: unknown) {
      console.error(err);
      setError("게시글 상세 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 현재 로그인한 사용자 정보 가져오기
  const fetchCurrentUser = async (): Promise<void> => {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/api/v1/auth/me`, {
        withCredentials: true,
      });
      // 응답 예시: { id: 1, email: "test@ezen.com", username: "realdeer", roles: [...] }
      if (response.data && response.data.id && response.data.username) {
        setCurrentUsername(response.data.username);
      } else {
        setCurrentUsername(null);
      }
    } catch (err) {
      console.error("현재 사용자 정보를 가져오지 못했습니다.", err);
      setCurrentUsername(null);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchCurrentUser();
    }
  }, [id]);

  const formatDate = (dateStr: string): string => {
    try {
      const parsedDate = parse(dateStr, "yyyy-MM-dd HH:mm:ss", new Date());
      if (isNaN(parsedDate.getTime())) {
        return "날짜 정보 없음";
      }
      return format(parsedDate, "yyyy-MM-dd HH:mm:ss");
    } catch (error) {
      console.error("날짜 파싱 오류", error);
      return "날짜 정보 없음";
    }
  };

  // 게시글 수정 핸들러 (예시: 별도 수정 페이지로 이동)
  const handlePostEdit = () => {
    router.push(`/community/posts/${post?.id}/edit`);
  };

  // 게시글 삭제 핸들러
  const handlePostDelete = async () => {
    if (!window.confirm("정말 게시글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API_GATEWAY_URL}/api/v1/questions/${post?.id}`, {
        withCredentials: true,
      });
      router.push("/community");
    } catch (err) {
      console.error(err);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

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
      <h1 className={styles.title}>{post.subject}</h1>
      <div className={styles.meta}>
        <span>작성자: {post.authorUsername}</span>
        <span>{formatDate(post.createdDate)}</span>
        <span>조회수: {post.viewCount}</span>
      </div>
      <div className={styles.postContentWrapper}>
        <div className={styles.content}>
          <p>{post.content}</p>
        </div>
        {currentUsername && currentUsername === post.authorUsername && (
          <div className={styles.postActions}>
            <button onClick={handlePostEdit} className={styles.editButton}>
              <img src="/edit_icon.png" alt="Edit" className={styles.icon} />
            </button>
            <button onClick={handlePostDelete} className={styles.deleteButton}>
              <img
                src="/delete_icon.png"
                alt="Delete"
                className={styles.icon}
              />
            </button>
          </div>
        )}
      </div>
      {/* 댓글 섹션 */}
      <PostCommentSection postId={post.id} initialComments={post.answers} />
    </div>
  );
}
