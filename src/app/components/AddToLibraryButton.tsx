"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

interface AddToLibraryButtonProps {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  thumbnail: string;
}

export default function AddToLibraryButton({
  isbn,
  title,
  author,
  publisher,
  thumbnail,
}: AddToLibraryButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
        const response = await axios.get(`${API_GATEWAY_URL}/api/v1/auth/me`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  if (!isLoggedIn) return null;

  // 쿼리 스트링에 책 정보를 포함시켜 MyLibraryAddPage로 전달합니다.
  const query = new URLSearchParams({
    title,
    author,
    publisher,
    thumbnail,
  }).toString();

  return (
    <Link href={`/book/${isbn}/add?${query}`}>
      <button className="add-library-button">내 서재에 추가</button>
    </Link>
  );
}
