"use client"; // 꼭 최상단에 위치해야 합니다.
import React, { useEffect, useState } from "react";
import axios from "axios";


interface UserInfoData {
  name: string;
  email: string;
  // 추가 필드가 있으면 여기 추가
}

const UserInfo: React.FC = () => {
  const [user, setUser] = useState<UserInfoData | null>(null);
  // localStorage는 클라이언트에서만 정의되므로, 컴포넌트가 클라이언트 전용임을 보장합니다.
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (token && userId) {
      axios
        .get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error("User info fetch error:", err));
    }
  }, [token, userId]);

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
          <button className="library-button">내 서재 보러가기</button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
