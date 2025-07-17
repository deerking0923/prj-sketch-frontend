"use client";

import React, { useRef } from "react";
import styles from "./OperationPage.module.css";

// 스몰멀티플 차트 전용 애니메이터들
import { runRetrieveValue } from "./functions/MultipleChart/retrieveValue";
import { filterValue }       from "./functions/MultipleChart/filterValue";

// 차트 컴포넌트
import SmallMultiplesChart from "./chart/SmallMultiplesChart";

export default function OperationPage() {
  // Retrieve 차트 전용
  const retrieveRef = useRef(null);
  // Filter 차트 전용
  const filterRef   = useRef(null);

  const onRetrieve = () => {
    runRetrieveValue(retrieveRef.current, {
      age:      "70-74",
      gender:   "Women",
      duration: 700,
    });
  };

  const onFilter = () => {
    filterValue(filterRef.current, {
      gender:    "Men",
      threshold: 70,     // Percentage < 70 인 남성 그룹만 보여줌
      duration:  800,
    });
  };

  return (
    <main className={styles.container}>
      <h1>스몰멀티플 차트: Retrieve VS Filter 애니메이션</h1>

      {/* Retrieve Value 전용 차트 */}
      <section className={styles.block}>
        <h2>1) Retrieve Value 애니메이션</h2>
        <div ref={retrieveRef} className={styles.chartHost} />
        <SmallMultiplesChart
          csvUrl="/data/kong_71.csv"
          mountRef={retrieveRef}
          xField="Age group"
          seriesField="gender"
          yField="Percentage"
        />
        <button className={styles.button} onClick={onRetrieve}>
          Retrieve Value 실행
        </button>
      </section>

      <hr className={styles.divider} />

      {/* Filter 전용 차트 */}
      <section className={styles.block}>
        <h2>2) Filter 애니메이션</h2>
        <div ref={filterRef} className={styles.chartHost} />
        <SmallMultiplesChart
          csvUrl="/data/kong_71.csv"
          mountRef={filterRef}
          xField="Age group"
          seriesField="gender"
          yField="Percentage"
        />
        <button className={styles.button} onClick={onFilter}>
          Percentage &lt; 70% 남성만
        </button>
      </section>
    </main>
  );
}
