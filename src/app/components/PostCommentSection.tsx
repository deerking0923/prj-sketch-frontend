"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import styles from "./style/PostCommentSection.module.css";

export interface Comment {
  id: number;
  content: string;
  createdDate: string;
  authorUsername: string;
}

interface PostCommentSectionProps {
  postId: number;
  initialComments: Comment[];
}

const PostCommentSection: React.FC<PostCommentSectionProps> = ({ postId, initialComments }) => {
  // 댓글 목록, 입력 및 수정 관련 상태
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");

  // 현재 로그인한 사용자 정보 (백엔드에서 /api/v1/auth/me 로 가져옴)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  // 현재 로그인한 사용자 정보 가져오기
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/auth/me`, { withCredentials: true });
      // 응답 예시: { roles: [...], id: 1, email: "test@ezen.com", username: "realdeer" }
      if (response.data && response.data.id && response.data.username) {
        setCurrentUserId(response.data.id);
        setCurrentUsername(response.data.username);
      } else {
        console.warn("현재 사용자 정보가 예상한 구조가 아닙니다.", response.data);
        setCurrentUserId(null);
        setCurrentUsername(null);
      }
    } catch (err) {
      console.error("현재 사용자 정보를 가져오지 못했습니다.", err);
      setCurrentUserId(null);
      setCurrentUsername(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // 댓글 목록 새로고침: 게시글 상세 API의 응답에서 댓글 배열(answers)을 가져옴
  const refreshComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/questions/${postId}`, {
        withCredentials: true,
      });
      // 응답 구조: { success: true, data: { ..., answers: Comment[] } }
      setComments(response.data.data.answers);
    } catch (err) {
      console.error(err);
      setError("댓글 목록을 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    refreshComments();
  }, [postId]);

  // 새 댓글 등록 (POST 요청)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (currentUserId === null) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/v1/answers`,
        {
          content: newComment,
          questionId: postId,
          userId: currentUserId,
        },
        { withCredentials: true }
      );
      setNewComment("");
      refreshComments();
    } catch (err) {
      console.error(err);
      setError("댓글 등록에 실패했습니다.");
    }
  };

  // 댓글 수정 (PUT 요청)
  const handleEditSubmit = async (commentId: number) => {
    if (!editingContent.trim()) return;
    try {
      await axios.put(
        `${API_URL}/api/v1/answers/${commentId}`,
        { content: editingContent },
        { withCredentials: true }
      );
      setEditingCommentId(null);
      setEditingContent("");
      refreshComments();
    } catch (err) {
      console.error(err);
      setError("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제 (DELETE 요청)
  const handleDelete = async (commentId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API_URL}/api/v1/answers/${commentId}`, {
        withCredentials: true,
      });
      refreshComments();
    } catch (err) {
      console.error(err);
      setError("댓글 삭제에 실패했습니다.");
    }
  };

  const formatDate = (dateStr: string): string => {
    try {
      const parsedDate = new Date(dateStr);
      return format(parsedDate, "yyyy-MM-dd HH:mm:ss");
    } catch (error) {
      console.error("날짜 포맷 오류", error);
      return dateStr;
    }
  };

  return (
    <div className={styles.commentSection}>
      <h2>댓글</h2>
      {error && <p className={styles.error}>{error}</p>}
      {comments.length === 0 ? (
        <p>작성된 댓글이 없습니다.</p>
      ) : (
        <ul className={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <span>{comment.authorUsername}</span>
                <span>{formatDate(comment.createdDate)}</span>
              </div>
              {editingCommentId === comment.id ? (
                <div className={styles.editSection}>
                  <textarea
                    className={styles.editInput}
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <button className={styles.saveButton} onClick={() => handleEditSubmit(comment.id)}>
                    저장
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingContent("");
                    }}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <>
                  <p className={styles.commentContent}>{comment.content}</p>
                  {currentUsername && currentUsername === comment.authorUsername && (
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editButton}
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditingContent(comment.content);
                        }}
                      >
                        수정
                      </button>
                      <button className={styles.deleteButton} onClick={() => handleDelete(comment.id)}>
                        삭제
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <textarea
          className={styles.commentTextarea}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          required
        />
        <button type="submit" className={styles.submitButton}>
          댓글 등록
        </button>
      </form>
    </div>
  );
};

export default PostCommentSection;
