# 다독다독 — MSA 버전 (Frontend)

## 한 줄 소개
Next.js 기반의 읽기 기록 서비스 UI (Production Deployment)

## 프로젝트 상태
✅ Production: AWS EC2에 Docker 기반 GitHub Actions CI/CD 파이프라인으로 자동 배포 완료. 데스크톱 환경 최적화. 모바일 반응형 미구현.

## 배포 링크
- Web App: https://dadoklog.com/

## 기능 목록
| 기능 | 설명 | 경로 |
|------|-------|------|
| 회원 가입/로그인 | JWT HTTP-Only Cookie 인증 | `/signup`, `/login` |
| 홈 페이지 | 전체 도서 목록 조회 (네이버 API 연동) | `/` |
| 도서 추가 | 읽기 기록 등록 | `/books/new` |
| 도서 상세/수정 | 기록 조회 및 수정 | `/books/[id]` |
| 개인 도서관 | 사용자별 도서 목록 조회 | `/library` |
| 최신 리뷰 | 최근 리뷰 목록 조회 | `/reviews` |

## 기술 스택
| Category | Technologies |
|----------|--------------|
| Framework | Next.js (TypeScript) |
| Styling | CSS Modules |
| Data Fetching | Axios |
| API Integration | Naver Books API |
| Deployment & CI/CD | Docker, GitHub Actions, AWS EC2, NGINX (Reverse Proxy) |
| Collaboration | Git/GitHub, Postman |
| Dev Environment | VS Code |

## 로컬 설치 & 실행
```bash
git clone https://github.com/deerking0923/dadok-project-frontend.git
cd dadok-frontend
npm install
npm run dev
```

## 환경 변수 (`.env`)
```dotenv
DATA4LIBRARY_AUTH_KEY=your_secretkey
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com/api/v1
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id
NEXT_PUBLIC_NAVER_CLIENT_SECRET=your_naver_client_secret
```

## 학습 포인트
- TypeScript로 정적 타입 적용
- 네이버 API 연동 방식 학습
- NGINX를 활용한 Reverse Proxy 설정
- Docker 기반 GitHub Actions CI/CD 파이프라인 구축 및 AWS EC2 배포

