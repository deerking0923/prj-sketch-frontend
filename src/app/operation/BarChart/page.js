"use client";

import React, { useRef } from "react";
import styles from "../OperationPage.module.css";
import SingleBarChart from "../chart/SingleBarChart";

import { runRetrieveValue }  from "../functions/BarChart/retrieveValue";
import { runFilter }         from "../functions/BarChart/filter";
import { runFindExtremum }   from "../functions/BarChart/findExtremum";
import { runDetermineRange } from "../functions/BarChart/determineRange";
import { runCompare }        from "../functions/BarChart/compare";
import { runSort }           from "../functions/BarChart/sort";        // ★

export default function BarChartPage() {
  /* refs */
  const ref20025 = useRef(null);
  const ref20111 = useRef(null);

  /* ───── 200_25 핸들러 ─────────────────── */
  const onRetrieve20025 = () =>
    runRetrieveValue(ref20025.current, { key: "BBC Radio 4", duration: 800 });

  const onFilter20025 = () =>
    runFilter(ref20025.current, { op: ">=", value: 100, duration: 800 });

  const onMax20025 = () =>
    runFindExtremum(ref20025.current, { type: "max", duration: 800 });

  const onRange20025 = () =>
    runDetermineRange(ref20025.current, { from: 50, to: 120, duration: 800 });

  const onCompare20025 = () =>
    runCompare(ref20025.current, {
      keyA: "BBC Radio 4",
      keyB: "BBC Local Radio",
      duration: 800,
    });

  const onSortAsc20025 = () =>
    runSort(ref20025.current, { order: "asc", duration: 800 });

  const onSortDesc20025 = () =>
    runSort(ref20025.current, { order: "desc", duration: 800 });

  /* ───── 201_11 핸들러 ─────────────────── */
  const onRetrieve20111 = () =>
    runRetrieveValue(ref20111.current, { key: "South Skåne", duration: 800 });

  const onFilter20111 = () =>
    runFilter(ref20111.current, { op: ">=", value: 200, duration: 800 });

  const onMin20111 = () =>
    runFindExtremum(ref20111.current, { type: "min", duration: 800 });

  const onRange20111 = () =>
    runDetermineRange(ref20111.current, { from: 100, to: 300, duration: 800 });

  const onCompare20111 = () =>
    runCompare(ref20111.current, {
      keyA: "South Skåne",
      keyB: "West Skåne",
      duration: 800,
    });

  const onSortAsc20111 = () =>
    runSort(ref20111.current, { order: "asc", duration: 800 });

  const onSortDesc20111 = () =>
    runSort(ref20111.current, { order: "desc", duration: 800 });

  /* ───── JSX ───────────────────────────── */
  return (
    <main className={styles.container}>
      <h1>단일 바 차트: Retrieve · Filter · Extremum · Range · Compare · Sort</h1>

      {/* ① Service 비용 */}
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
          <button className={styles.button} onClick={onRetrieve20025}>BBC Radio 4</button>
          <button className={styles.button} onClick={onFilter20025}>비용 ≥ 100</button>
          <button className={styles.button} onClick={onMax20025}>최댓값</button>
          <button className={styles.button} onClick={onRange20025}>50–120 범위</button>
          <button className={styles.button} onClick={onCompare20025}>Radio 4 vs Local</button>
          <button className={styles.button} onClick={onSortAsc20025}>오름차순 정렬</button>
          <button className={styles.button} onClick={onSortDesc20025}>내림차순 정렬</button>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ② Region 밀도 */}
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
          <button className={styles.button} onClick={onRetrieve20111}>South Skåne</button>
          <button className={styles.button} onClick={onFilter20111}>밀도 ≥ 200</button>
          <button className={styles.button} onClick={onMin20111}>최솟값</button>
          <button className={styles.button} onClick={onRange20111}>100–300 범위</button>
          <button className={styles.button} onClick={onCompare20111}>South vs West</button>
          <button className={styles.button} onClick={onSortAsc20111}>오름차순 정렬</button>
          <button className={styles.button} onClick={onSortDesc20111}>내림차순 정렬</button>
        </div>
      </section>
    </main>
  );
}
