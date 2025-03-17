"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UserInfoData {
  name: string;
  email: string;
  // 필요한 추가 필드를 여기에 선언
}

const UserInfo: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserInfoData | null>(null);

  // localStorage는 브라우저에서만 존재합니다.
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // 환경 변수에서 API_GATEWAY_URL을 불러옵니다.
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  useEffect(() => {
    if (token && userId && API_GATEWAY_URL) {
      axios
        .get(`${API_GATEWAY_URL}/user-service/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error("User info fetch error:", err));
    }
  }, [token, userId, API_GATEWAY_URL]);

  if (!token || !userId) {
    return (
      <div className="user-info">
        <h2>사용자 정보</h2>
        <div className="profile">
          <p>로그인 해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-info">
      <h2>사용자 정보</h2>
      <div className="profile">
        <div className="avatar" />
        <div className="user-details">
          <p>{user ? user.name : "사용자 이름"}</p>
          <p>{user ? `나의 글: ${user.email}` : "나의 글: 게시글이 없습니다."}</p>
          <button
            className="library-button"
            onClick={() => router.push("/mylibrary")}
          >
            내 서재 보러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
