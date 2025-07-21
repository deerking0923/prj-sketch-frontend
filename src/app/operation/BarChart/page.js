// src/app/operation/BarChart/page.js
"use client";

import React, { useRef } from "react";
import styles from "../OperationPage.module.css";
import SingleBarChart from "../chart/SingleBarChart";
import { runRetrieveValue } from "../functions/BarChart/retrieveValue";

export default function BarChartPage() {
  // 첫 번째 차트(ref20025)는 wikitables-200_25.csv
  const ref20025 = useRef(null);
  // 두 번째 차트(ref20111)는 wikitables-201_11.csv
  const ref20111 = useRef(null);

  // 2012/13 Total Cost 차트에서 강조할 key
  const onRetrieve20025 = () => {
    runRetrieveValue(ref20025.current, {
      key: "BBC Radio 4",  // 강조할 Service 이름
      duration: 800,
    });
  };

  // Density 차트에서 강조할 key
  const onRetrieve20111 = () => {
    runRetrieveValue(ref20111.current, {
      key: "South Skåne",  // 강조할 Region 이름
      duration: 800,
    });
  };

  return (
    <main className={styles.container}>
      <h1>단일 바 차트: Retrieve 애니메이션</h1>

      {/* ─── 1) 200_25 데이터 차트 ──────────────────────────────── */}
      <section className={styles.block}>
        <h2>2012/13 Total Cost (wikitables-200_25.csv)</h2>
        <div ref={ref20025} className={styles.chartHost} />
        <SingleBarChart
          csvUrl="/data/wikitables-200_25.csv"
          mountRef={ref20025}
          xField="Service"
          yField="2012/13 Total Cost"
        />
        <button className={styles.button} onClick={onRetrieve20025}>
          BBC Radio 4 강조
        </button>
      </section>

      <hr className={styles.divider} />

      {/* ─── 2) 201_11 데이터 차트 ──────────────────────────────── */}
      <section className={styles.block}>
        <h2>Density by Region (wikitables-201_11.csv)</h2>
        <div ref={ref20111} className={styles.chartHost} />
        <SingleBarChart
          csvUrl="/data/wikitables-201_11.csv"
          mountRef={ref20111}
          xField="Region"
          yField="Density"
        />
        <button className={styles.button} onClick={onRetrieve20111}>
          South Skåne 강조
        </button>
      </section>
    </main>
  );
}
