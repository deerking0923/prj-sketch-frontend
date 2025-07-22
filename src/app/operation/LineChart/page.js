"use client";

import React, { useRef } from "react";
import styles from "../OperationPage.module.css";
import SingleLineChart from "../chart/SingleLineChart";
import { runRetrieveValue } from "../functions/LineChart/retrieveValue";

export default function LineChartPage() {
  const ref = useRef(null);

  const onRetrieve = () => {
    // 강조할 year(예: 2014)와 애니메이션 길이를 전달
    runRetrieveValue(ref.current, { key: 2014, duration: 800 });
  };

  return (
    <main className={styles.container}>
      <h1>단일 라인 차트: Retrieve 애니메이션</h1>

      <section className={styles.block}>
        <h2>Revenue by Year (d3_3001_0.csv)</h2>
        <div ref={ref} className={styles.chartHost} />
        <SingleLineChart
          csvUrl="/data/d3_3001_0.csv"
          mountRef={ref}
          xField="year"
          yField="revenue"
        />
        <button className={styles.button} onClick={onRetrieve}>
          2014 강조
        </button>
      </section>
    </main>
  );
}
