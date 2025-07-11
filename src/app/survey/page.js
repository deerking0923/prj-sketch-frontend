'use client';

import dynamic from 'next/dynamic';

// 클라이언트 전용 컴포넌트 동적 로딩
const SurveyClient = dynamic(() => import('./SurveyClient'), { ssr: false });

export default function Page() {
  return <SurveyClient />;
}
