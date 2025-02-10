// src/app/components/CommunityBoard.tsx
import React from 'react';

const CommunityBoard: React.FC = () => {
  return (
    <div className="community-board">
      <h2>커뮤니티 게시판</h2>
      <table className="board-table">
        <tbody>
          <tr>
            <td>제목 : 게시글 제목</td>
            <td>작성자 : 사용자명</td>
            <td>댓글 수 : 3</td>
          </tr>
          <tr>
            <td>제목 : 게시글 제목</td>
            <td>작성자 : 사용자명</td>
            <td>댓글 수 : 1</td>
          </tr>
          <tr>
            <td>제목 : 게시글 제목</td>
            <td>작성자 : 사용자명</td>
            <td>댓글 수 : 0</td>
          </tr>
          <tr>
            <td>제목 : 게시글 제목</td>
            <td>작성자 : 사용자명</td>
            <td>댓글 수 : 2</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CommunityBoard;
