"use client";

import React, { useRef } from "react";
import styles from "./OperationPage.module.css";

import { runRetrieveValue } from "./functions/retrieveValue";
import UniversalBarChart from "./chart/UniversalBarChart";

export default function OperationPage() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const replay1 = () => {
    runRetrieveValue(ref1.current, {
      age: "70-74",
      gender: "Women",
      duration: 700,
    });
  };

  const replay2 = () => {
    runRetrieveValue(ref2.current, {
      age: "BBC Radio 4",
      gender: "+ 6.2",
      duration: 700,
    });
  };

  return (
    <main className={styles.container}>
      <h1>범용 Retrieve Value Animation</h1>

      <section>
        <h2>1) Age–Gender 차트</h2>
        <div ref={ref1} className={styles.chartHost} />
        <UniversalBarChart
          csvUrl="/data/kong_71.csv"
          mountRef={ref1}
          xField="Age group"
          seriesField="gender"
          yField="Percentage"
        />
        <button className={styles.button} onClick={replay1}>
          Replay 1
        </button>
      </section>

      <hr />

      <section>
        <h2>2) BBC Radio 비용 차트</h2>

        {/* ← 이 div가 있어야 차트가 표시됩니다 */}
        <div ref={ref2} className={styles.chartHost} />

        <UniversalBarChart
          csvUrl="/data/wikitables-200_25.csv"
          mountRef={ref2}
          xField="Service"
          seriesField="Comparison with 2011/12"
          yField="2012/13 Total Cost"
        />

        <button className={styles.button} onClick={replay2}>
          Replay 2
        </button>
      </section>
    </main>
  );
}
