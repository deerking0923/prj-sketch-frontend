'use client';

import React from 'react';
import Image from 'next/image';
import BarChart from './components/BarChart';
import Histogram from './components/Histogram';
import HighlightHistogram from './components/HighlightHistogram';   // ★ 새 import
import styles from './style/HomePage.module.css';
import CompareHistogram from './components/CompareHistogram';
import RankHistogram from './components/RankHistogram'; 

export default function HomePage() {
  /* 데모 차트용 데이터 */
  const demoData = [
    { category: 'A', value: 30 },
    { category: 'B', value: 80 },
    { category: 'C', value: 45 },
    { category: 'D', value: 60 },
    { category: 'E', value: 20 },
  ];

  /* 월별 강수량(근사) */
  const precipData = [
    { category: 'Jan', value: 3.8 },
    { category: 'Feb', value: 3.75 },
    { category: 'Mar', value: 4.9 },
    { category: 'Apr', value: 3.2 },
    { category: 'May', value: 1.7 },
    { category: 'Jun', value: 1.1 },
    { category: 'Jul', value: 0.4 },
    { category: 'Aug', value: 1.3 },
    { category: 'Sep', value: 2.0 },
    { category: 'Oct', value: 4.0 },
    { category: 'Nov', value: 5.3 },
    { category: 'Dec', value: 5.0 },
  ];

  return (
    <main className={styles.container}>
      {/* ① BarChart 데모 */}
      <h2 className={styles.title}>BarChart Demo (A‒E)</h2>
      <div className={styles.chartSection}>
        <BarChart width={600} height={350} data={demoData} />
      </div>

      {/* ② 문제 설명 이미지 */}
      <Image
        src="/ChartExample/Question1.png"
        alt="Formative study prompt"
        width={1024}
        height={0}
        className={styles.figure}
        priority
      />

      {/* ③ 원본 히스토그램 */}
      <h2 className={styles.subtitle}>Monthly Precipitation Histogram</h2>
      <div className={styles.chartSection}>
        <Histogram width={700} height={400} data={precipData} gap={0.03} />
      </div>

      {/* ④ 1번 질문 & 하이라이트 히스토그램 */}
      <h3 className={styles.question}>
        (1) single operation – 강수량이 가장 높은 달과 가장 낮은 달을 각각
        찾아보세요.
      </h3>
      <div className={styles.chartSection}>
        <HighlightHistogram
          width={700}
          height={400}
          data={precipData}
          gap={0.03}
        />
      </div>

      <h3 className={styles.question}>
        (2) comparison – 1월과 10월의 강수량을 비교해 어느쪽이 더 많은지 알려주세요.
      </h3>
      <div className={styles.chartSection}>
        <CompareHistogram
          width={700}
          height={400}
          data={precipData}
          gap={0.03}
        />
      </div>

      <h3 className={styles.question}>
        (3) multiple operations – 상반기 데이터 중에서 세 번째로 강수량이 많은
        달은 언제이고, 그 값은 얼마인가요?
      </h3>
      <div className={styles.chartSection}>
        <RankHistogram
          width={700}
          height={400}
          data={precipData}
          gap={0.03}
        />
      </div>
    </main>
  );
}
