"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProfilePage.module.css';

interface ResponseReview {
  id: number;
  isbn: string;
  userId: string;
  createDate: string; // ISO 형식 날짜 문자열
  content: string;
}

interface UserProfile {
  email: string;
  name: string;
  userId: string;
  reviews: ResponseReview[];
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setError('프로필을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!profile) return <div className={styles.error}>프로필이 없습니다.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <h1>{profile.name}님의 프로필</h1>
        <p>Email: {profile.email}</p>
        {/* <p>User ID: {profile.userId}</p> */}
      </div>

      <div className={styles.reviewsSection}>
        <h2>내가 쓴 리뷰</h2>
        {profile.reviews && profile.reviews.length > 0 ? (
          <ul className={styles.reviewList}>
            {profile.reviews.map((review) => (
              <li key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewIsbn}>ISBN: {review.isbn}</span>
                  <span className={styles.reviewDate}>
                    {new Date(review.createDate).toLocaleDateString()}
                  </span>
                </div>
                <p className={styles.reviewContent}>{review.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
