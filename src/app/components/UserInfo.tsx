// src/app/components/UserInfo.tsx
import React from 'react';

const UserInfo: React.FC = () => {
  return (
    <div className="user-info">
      <h2>사용자 정보</h2>
      <div className="profile">
        <div className="avatar" />
        <div className="user-details">
          <p>사용자 이름</p>
          <p>나의 글: 게시글이 없습니다.</p>
          <button className="library-button">내 서재 보러가기</button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
