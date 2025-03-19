// app/components/LibraryAddButton.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface LibraryAddButtonProps {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  thumbnail: string;
}

const LibraryAddButton: React.FC<LibraryAddButtonProps> = ({
  isbn,
  title,
  author,
  publisher,
  thumbnail,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  if (!isLoggedIn) {
    return null; // 로그인하지 않은 경우 표시하지 않음
  }

  return (
    <Link
      href={`/book/${isbn}/add?title=${encodeURIComponent(
        title
      )}&author=${encodeURIComponent(author)}&publisher=${encodeURIComponent(
        publisher
      )}&thumbnail=${encodeURIComponent(thumbnail)}`}
      className="library-add-button"
    >
      내 서재에 추가
    </Link>
  );
};

export default LibraryAddButton;
