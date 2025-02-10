// src/app/api/naver-book-search/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 요청 URL에서 query 파라미터 추출
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  // 네이버 API URL (예시: 도서 검색 API)
  const apiUrl = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}`;

  // API 호출 (환경 변수로부터 클라이언트 ID, Secret을 사용)
  const response = await fetch(apiUrl, {
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID!,
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET!,
    },
  });

  // 외부 API 응답을 JSON 형태로 파싱
  const data = await response.json();

  // 클라이언트에 응답 반환
  return NextResponse.json(data);
}
