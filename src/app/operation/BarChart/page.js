"use client";

import React, { useRef } from "react";
import styles from "../OperationPage.module.css";
import SingleBarChart from "../chart/SingleBarChart";

import { runRetrieveValue } from "../functions/BarChart/retrieveValue";
import { runFilter }       from "../functions/BarChart/filter";

export default function BarChartPage() {
  const ref20025 = useRef(null);
  const ref20111 = useRef(null);

  /* 200_25 */
  const onRetrieve20025 = () =>
    runRetrieveValue(ref20025.current, { key: "BBC Radio 4", duration: 800 });

  const onFilter20025 = () =>
    runFilter(ref20025.current, { op: ">=", value: 100, duration: 800 });

  /* 201_11 */
  const onRetrieve20111 = () =>
    runRetrieveValue(ref20111.current, { key: "South Skåne", duration: 800 });

  const onFilter20111 = () =>
    runFilter(ref20111.current, { op: ">=", value: 200, duration: 800 });

  return (
    <main className={styles.container}>
      <h1>단일 바 차트: Retrieve & Filter</h1>

      <section className={styles.block}>
        <h2>2012/13 Total Cost (wikitables-200_25.csv)</h2>
        <div ref={ref20025} className={styles.chartHost} />
        <SingleBarChart
          csvUrl="/data/wikitables-200_25.csv"
          mountRef={ref20025}
          xField="Service"
          yField="2012/13 Total Cost"
        />
        <div className={styles.buttonRow}>
          <button className={styles.button} onClick={onRetrieve20025}>
            BBC Radio 4 강조
          </button>
          <button className={styles.button} onClick={onFilter20025}>
            비용 ≥ 100 강조
          </button>
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.block}>
        <h2>Density by Region (wikitables-201_11.csv)</h2>
        <div ref={ref20111} className={styles.chartHost} />
        <SingleBarChart
          csvUrl="/data/wikitables-201_11.csv"
          mountRef={ref20111}
          xField="Region"
          yField="Density"
        />
        <div className={styles.buttonRow}>
          <button className={styles.button} onClick={onRetrieve20111}>
            South Skåne 강조
          </button>
          <button className={styles.button} onClick={onFilter20111}>
            밀도 ≥ 200 강조
          </button>
        </div>
      </section>
    </main>
  );
}
