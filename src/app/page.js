// src/app/page.js
'use client';
import React from 'react';
import BarChart from './components/BarChart';   // 같은 app 내부이므로 './components'

export default function HomePage() {
  const data = [
    { category: 'A', value: 30 },
    { category: 'B', value: 80 },
    { category: 'C', value: 45 },
    { category: 'D', value: 60 },
    { category: 'E', value: 20 },
  ];

  return (
    <main style={{ padding: '2rem' }}>
      <h2>BarChart</h2>
      <BarChart width={600} height={350} data={data} />
    </main>
  );
}
