"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";  // Link 컴포넌트 임포트
import styles from "./style/RecentReviews.module.css";

interface Review {
  id: number;
  isbn: string;
  userId: string;
  createDate: string;
  content: string;
  title?: string; // 도서 제목을 추가
}

const RecentReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  const fetchReviews = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get<Review[]>(`${API_GATEWAY_URL}/recentreview-service/reviews`);
      const reviewsData = response.data;

      // ISBN을 통해 도서 제목을 가져오기
      const updatedReviews = await Promise.all(
        reviewsData.map(async (review) => {
          const bookTitle = await fetchBookTitleByIsbn(review.isbn);
          return { ...review, title: bookTitle };
        })
      );

      setReviews(updatedReviews); // 도서 제목을 추가한 리뷰 데이터로 상태 업데이트
    } catch (err: unknown) {
      console.error(err);
      setError("최근 리뷰를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookTitleByIsbn = async (isbn: string): Promise<string> => {
    try {
      // Next.js API 라우트로 데이터 요청
      const response = await axios.get(`/api/naver-book-search?query=${isbn}`);
      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0].title; // 제목 반환
      }
      return "제목을 찾을 수 없습니다.";
    } catch (err) {
      console.error(err);
      return "제목을 가져오는데 실패했습니다.";
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
              <span className={styles.reviewDate}>
                {format(new Date(review.createDate), "yyyy-MM-dd")}
              </span>
            </div>
            {/* 도서 제목을 화면에 표시하고 클릭 시 해당 책 페이지로 이동 */}
            <p className={styles.reviewTitle}>
              도서 제목:{" "}
              <Link href={`/book/${review.isbn}`} className={styles.bookLink}>
                {review.title}
              </Link>
            </p>
            <p className={styles.reviewContent}>{review.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentReviews;
