"use client";

import React from "react";
import AgeGenderChart from "../components/AgeGenderChart";           // 원본(전체 차트)
import WelcomeFeelAnimation from "../components/WelcomeFeelAnimation"; // Q1
import WomenMinBelongAnimation from "../components/WomenMinBelongAnimation"; // Q2
import "../style/ageChart.css";

export default function SamplePage() {
  return (
    <main className="container">
      {/* 0) 원본 전체 차트 */}
      <h1 className="heading">Employment Rate by Age Group &amp; Gender</h1>
      <AgeGenderChart />

      {/* 1) 첫 번째 질문 – Women vs Men 비교 */}
      <WelcomeFeelAnimation />

      {/* 2) 두 번째 질문 – 여성 최저 비율 */}
      <WomenMinBelongAnimation />
    </main>
  );
}
