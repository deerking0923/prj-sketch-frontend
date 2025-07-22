"use client";

import React, { useRef } from "react";
import styles from "../OperationPage.module.css";
import SingleLineChart from "../chart/SingleLineChart";
import { runRetrieveValue } from "../functions/LineChart/retrieveValue";
import { runFilter } from "../functions/LineChart/filter";   // ★ 추가

export default function LineChartPage() {
  const ref = useRef(null);

  // ─── Retrieve(단일 값 강조) ───────────────────────────────
  const onRetrieve = () => {
    runRetrieveValue(ref.current, { key: 2014, duration: 800 });
  };

  // ─── Filter(조건부 강조) ────────────────────────────────
  const onFilter = () => {
    runFilter(ref.current, { op: ">=", value: 2010, duration: 800 });
  };

  return (
    <main className={styles.container}>
      <h1>단일 라인 차트: Retrieve & Filter 애니메이션</h1>

      <section className={styles.block}>
        <h2>Revenue by Year (d3_3001_0.csv)</h2>
        <div ref={ref} className={styles.chartHost} />
        <SingleLineChart
          csvUrl="/data/d3_3001_0.csv"
          mountRef={ref}
          xField="year"
          yField="revenue"
        />

        {/* ─ 버튼 영역 ─ */}
        <div className={styles.buttonRow}>
          <button className={styles.button} onClick={onRetrieve}>
            2014 강조 (Retrieve)
          </button>
          <button className={styles.button} onClick={onFilter}>
            2010년 이후만 강조 (Filter)
          </button>
        </div>
      </section>
    </main>
  );
}
