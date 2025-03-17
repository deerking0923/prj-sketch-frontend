"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./style/PostCommentSection.module.css";

interface Comment {
  id: number;
  userId: string;
  userName: string; // 추가된 필드: 백엔드에서 전달받은 username 사용
  createDate: string; // API에서 반환되는 날짜 문자열 (createDate로 통일)
  content: string;
}

interface PostCommentSectionProps {
  postId: number;
}


const PostCommentSection: React.FC<PostCommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");

  // 현재 로그인한 사용자 ID와 토큰 (실제 인증정보로 대체)
  const currentUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  // 댓글 목록을 불러오는 함수
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get<Comment[]>(
        `${API_URL}/community-service/comments/post/${postId}`
      );
      setComments(res.data);
    } catch (err) {
      console.error(err);
      setError("댓글 불러오기에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 새 댓글 등록
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!token || !currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/community-service/comments/${currentUserId}`,
        {
          postId,
          content: newComment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error(err);
      setError("댓글 등록에 실패했습니다.");
    }
  };

  // 댓글 수정
  const handleEditSubmit = async (commentId: number) => {
    if (!token || !currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/community-service/comments/${currentUserId}/${commentId}`,
        { content: editingContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCommentId(null);
      setEditingContent("");
      fetchComments();
    } catch (err) {
      console.error(err);
      setError("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId: number) => {
    if (!token || !currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(
        `${API_URL}/community-service/comments/${currentUserId}/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
    } catch (err) {
      console.error(err);
      setError("댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className={styles.commentSection}>
      <h2>댓글</h2>
      {loading ? (
        <p>댓글 로딩 중...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : comments.length === 0 ? (
        <p>작성된 댓글이 없습니다.</p>
      ) : (
        <ul className={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <span>{comment.userName || comment.userId}</span>
                <span>{new Date(comment.createDate).toLocaleDateString()}</span>
              </div>
              {editingCommentId === comment.id ? (
                <div className={styles.editSection}>
                  <textarea
                    className={styles.editInput}
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <button
                    onClick={() => handleEditSubmit(comment.id)}
                    className={styles.saveButton}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingContent("");
                    }}
                    className={styles.cancelButton}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <>
                  <p className={styles.commentContent}>{comment.content}</p>
                  {currentUserId === comment.userId && (
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditingContent(comment.content);
                        }}
                        className={styles.editButton}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className={styles.deleteButton}
                      >
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
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className={styles.commentTextarea}
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
