// pages/index.tsx (혹은 해당 파일)
import React, { JSX } from 'react';
import './home.css';

export default function Home(): JSX.Element {
  return (
    <div className="main-container">
      <main className="content">
        <section className="popular-books">
          <h2>인기 도서 (도서관 정보나루 API에서 따올 예정)</h2>
          <div className="book-grid">
            <div className="book-item" />
            <div className="book-item" />
            <div className="book-item" />
            <div className="book-item" />
          </div>
        </section>
        {/* 게시판과 사용자 정보를 묶는 컨테이너 */}
        <section className="widgets">
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
        </section>
      </main>
    </div>
  );
}
