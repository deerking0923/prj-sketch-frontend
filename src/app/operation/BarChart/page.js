// src/app/operation/BarChart/page.js
"use client";

import React, { useRef } from "react";
import styles from "../OperationPage.module.css";
import SingleBarChart from "../chart/SingleBarChart";

import { runRetrieveValue } from "../functions/BarChart/retrieveValue";
import { runFilter }       from "../functions/BarChart/filter";
import { runFindExtremum } from "../functions/BarChart/findExtremum";

export default function BarChartPage() {
  /* ───────────────────────────────────────────────────────────
     1. Refs (차트 DOM 컨테이너)
  ─────────────────────────────────────────────────────────── */
  const ref20025 = useRef(null);   // wikitables-200_25.csv (Service 비용)
  const ref20111 = useRef(null);   // wikitables-201_11.csv (Region 밀도)

  /* ───────────────────────────────────────────────────────────
     2. 200_25 데이터용 핸들러
  ─────────────────────────────────────────────────────────── */
  const onRetrieve20025 = () =>
    runRetrieveValue(ref20025.current, {
      key: "BBC Radio 4",
      duration: 800,
    });

  const onFilter20025 = () =>
    runFilter(ref20025.current, {
      op: ">=",
      value: 100,         // 비용 ≥ 100
      duration: 800,
    });

  const onMax20025 = () =>
    runFindExtremum(ref20025.current, {
      type: "max",        // 최댓값
      duration: 800,
    });

  /* ───────────────────────────────────────────────────────────
     3. 201_11 데이터용 핸들러
  ─────────────────────────────────────────────────────────── */
  const onRetrieve20111 = () =>
    runRetrieveValue(ref20111.current, {
      key: "South Skåne",
      duration: 800,
    });

  const onFilter20111 = () =>
    runFilter(ref20111.current, {
      op: ">=",
      value: 200,         // Density ≥ 200
      duration: 800,
    });

  const onMin20111 = () =>
    runFindExtremum(ref20111.current, {
      type: "min",        // 최솟값
      duration: 800,
    });

  /* ───────────────────────────────────────────────────────────
     4. JSX
  ─────────────────────────────────────────────────────────── */
  return (
    <main className={styles.container}>
      <h1>단일 바 차트: Retrieve · Filter · Extremum</h1>

      {/* ─── ① wikitables-200_25.csv ───────────────────────── */}
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
            비용&nbsp;≥&nbsp;100 강조
          </button>
          <button className={styles.button} onClick={onMax20025}>
            최댓값 강조
          </button>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ─── ② wikitables-201_11.csv ───────────────────────── */}
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
            밀도&nbsp;≥&nbsp;200 강조
          </button>
          <button className={styles.button} onClick={onMin20111}>
            최솟값 강조
          </button>
        </div>
      </section>
    </main>
  );
}
