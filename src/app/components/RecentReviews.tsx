"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import styles from "./style/RecentReviews.module.css";

interface Review {
  id: number;
  isbn: string;
  userId: string;
  createDate: string;
  content: string;
}

const RecentReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // 환경 변수에서 API_GATEWAY_URL 불러오기 (클라이언트 코드이므로 NEXT_PUBLIC_ 접두사가 필요합니다.)
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  const fetchReviews = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      // 최근 review-service 엔드포인트 호출
      const response = await axios.get<Review[]>(`${API_GATEWAY_URL}/recentreview-service/reviews`);
      setReviews(response.data);
    } catch (err: unknown) {
      console.error(err);
      setError("최근 리뷰를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return <p>최근 리뷰 로딩 중...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (reviews.length === 0) return <p>최근 리뷰가 없습니다.</p>;

  return (
    <div className={styles.reviewsContainer}>
      <h2>최근 리뷰</h2>
      <ul className={styles.reviewList}>
        {reviews.map((review, index) => (
          <li key={review.id || index} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <span className={styles.reviewIsbn}>ISBN: {review.isbn}</span>
              <span className={styles.reviewDate}>
                {format(new Date(review.createDate), "yyyy-MM-dd")}
              </span>
            </div>
            <p className={styles.reviewContent}>{review.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentReviews;
