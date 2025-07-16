"use client";

import React from "react";
import AgeGenderChart from "../components/AgeGenderChart";
import WelcomeFeelAnimation from "../components/WelcomeFeelAnimation";
import WomenMinBelongAnimation from "../components/WomenMinBelongAnimation";

import RetrieveValueAnimation from "../components/RetrieveValueAnimation";
import FilterAnimation from "../components/FilterAnimation";
import ExtremumAnimation from "../components/ExtremumAnimation";
import RangeAnimation from "../components/RangeAnimation";
import CompareAnimation from "../components/CompareAnimation";
import SortAnimation from "../components/SortAnimation";

import "../style/ageChart.css";

export default function SamplePage() {
  return (
    <main className="container">
      {/* 0) 원본 정적 차트 */}
      <h1 className="heading">Employment Rate by Age Group &amp; Gender</h1>
      <AgeGenderChart />

      {/* 1) Q1 */}
      <WelcomeFeelAnimation />

      {/* 2) Q2 */}
      <WomenMinBelongAnimation />

      {/* 3–8) 기본 오퍼레이션 데모 */}
      <RetrieveValueAnimation />
      <FilterAnimation />
      <ExtremumAnimation />
      <RangeAnimation />
      <CompareAnimation />
      <SortAnimation />
    </main>
  );
}
