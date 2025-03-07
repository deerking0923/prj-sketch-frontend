"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import styles from "./ProfilePage.module.css";

interface ResponseReview {
  id: number;
  isbn: string;
  userId: string;
  createDate: string; // ISO 형식 날짜 문자열
  content: string;
}

interface ResponsePost {
  id: number;
  userId: string;
  title: string;
  content: string;
  createDate: string; // ISO 형식 날짜 문자열
  viewCount: number;
}

interface ResponseComment {
  id: number;
  userId: string;
  postId: number;
  createDate: string; // ISO 형식 날짜 문자열
  content: string;
}

interface UserProfile {
  email: string;
  name: string;
  userId: string;
  reviews: ResponseReview[];
  posts: ResponsePost[];
  comments: ResponseComment[];
}

type TabType = "reviews" | "posts" | "comments";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("reviews");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("로그인 정보가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get<UserProfile>(
          `http://127.0.0.1:8000/user-service/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("프로필을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!profile) return <div className={styles.error}>프로필이 없습니다.</div>;

  const renderContent = () => {
    switch (activeTab) {
      case "reviews": {
        const sortedReviews = [...profile.reviews].sort(
          (a, b) =>
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        );
        return sortedReviews.length > 0 ? (
          <ul className={styles.list}>
            {sortedReviews.map((review) => (
              <li key={review.id} className={styles.item}>
                <Link href={`/book/${review.isbn}`}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemIsbn}>ISBN: {review.isbn}</span>
                    <span className={styles.itemDate}>
                      {new Date(review.createDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={styles.itemContent}>{review.content}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 리뷰가 없습니다.</p>
        );
      }
      case "posts": {
        const sortedPosts = [...profile.posts].sort(
          (a, b) =>
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        );
        return sortedPosts.length > 0 ? (
          <ul className={styles.list}>
            {sortedPosts.map((post) => (
              <li key={post.id} className={styles.item}>
                <Link href={`/community/posts/${post.id}`}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemTitle}>{post.title}</span>
                    <span className={styles.itemDate}>
                      {new Date(post.createDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={styles.itemContent}>{post.content}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 게시글이 없습니다.</p>
        );
      }
      case "comments": {
        const sortedComments = [...profile.comments].sort(
          (a, b) =>
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        );
        return sortedComments.length > 0 ? (
          <ul className={styles.list}>
            {sortedComments.map((comment) => (
              <li key={comment.id} className={styles.item}>
                <Link href={`/community/posts/${comment.postId}`}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemDate}>
                      {new Date(comment.createDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={styles.itemContent}>{comment.content}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 댓글이 없습니다.</p>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <h1>{profile.name}님의 프로필</h1>
        <p>Email: {profile.email}</p>
      </div>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "reviews" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          내가 쓴 리뷰
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "posts" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("posts")}
        >
          내가 쓴 게시글
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "comments" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("comments")}
        >
          내가 쓴 댓글
        </button>
      </div>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
};

export default ProfilePage;
