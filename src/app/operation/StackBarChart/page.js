"use client";

import React, { useRef } from "react";
import StackBarChart from "../chart/StackBarChart";
import { runRetrieveValue } from "../functions/StackBarChart/retrieveValue";

export default function Page() {
  const chartDivRef = useRef(null);
  const chartApiRef = useRef(null);

  const handleHighlight = () => {
    if (!chartDivRef.current) return;
    runRetrieveValue(chartDivRef.current, {
      category: "Muslims",   // kong_5.csv의 xField 값
      series:   "Growing",   // kong_5.csv의 seriesField 값
      duration: 800
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Stacked Bar Chart 하이라이트 시연</h1>
      <div
        ref={chartDivRef}
        style={{ width: 600, height: 300, border: "1px solid #ccc" }}
      />
      <StackBarChart
        ref={chartApiRef}
        mountRef={chartDivRef}
        csvUrl="/data/kong_5.csv"
        xField="Religion"
        seriesField="Growth?"
        yField="Percentage"
      />
      <button onClick={handleHighlight} style={{ marginTop: 10 }}>
        “Muslims–Growing” 하이라이트
      </button>
    </div>
  );
}
