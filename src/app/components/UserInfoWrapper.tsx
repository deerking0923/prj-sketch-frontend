// src/app/components/UserInfoWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// ssr: false로 설정하여 이 컴포넌트는 서버 사이드 렌더링에서 제외됩니다.
const DynamicUserInfo = dynamic(() => import("./UserInfo"), { ssr: false });

export default function UserInfoWrapper() {
  return <DynamicUserInfo />;
}
