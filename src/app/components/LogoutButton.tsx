// src/app/components/LogoutButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // localStorage에서 토큰과 사용자 ID 삭제
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // 로그아웃 후 홈으로 이동한 후 페이지 새로고침
    router.push("/");
    window.location.reload();  // 강제 새로고침
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      로그아웃
    </button>
  );
};

export default LogoutButton;
