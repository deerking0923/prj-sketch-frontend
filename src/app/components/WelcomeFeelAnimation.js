"use client";

import React, { useRef } from "react";
import AgeGenderChart from "./AgeGenderChart";
import useFilterCompareAnimation from "./useFilterCompareAnimation";
import "../style/ageChart.css";

export default function WelcomeFeelAnimation({ csvUrl = "/data/kong_71.csv" }) {
  const chartHostRef = useRef(null);
  // custom hook: 애니메이션 & replay
  const { replay } = useFilterCompareAnimation({ ref: chartHostRef });

  return (
    <section className="q1-block">
      <h2 className="q-heading">
        Did more women or men overall feel welcome?
      </h2>

      <div ref={chartHostRef} className="chartHost" />
      {/* 정적 차트 */}
      <AgeGenderChart csvUrl={csvUrl} mountRef={chartHostRef} />

      <button type="button" className="replayBtn" onClick={replay}>
        Replay Animation
      </button>
    </section>
  );
}
