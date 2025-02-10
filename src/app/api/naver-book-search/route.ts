// src/app/api/naver-book-search/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const start = searchParams.get('start') || '1';      // start 파라미터 읽기, 기본값 1
  const display = searchParams.get('display') || '10';   // display 파라미터 읽기, 기본값 10

  // 네이버 도서 검색 API URL에 start와 display 파라미터 추가
  const apiUrl = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&start=${start}&display=${display}`;

  const response = await fetch(apiUrl, {
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID!,
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET!,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}
