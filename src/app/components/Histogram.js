'use client';
import React from 'react';
import { useD3 } from './useD3';
import * as d3 from 'd3';

export default function Histogram({
  width  = 700,
  height = 400,
  data   = [],
  gap    = 0.02,          // 0 ≈ 완전 밀착, 0.02~0.05 = 아주 좁은 틈
}) {
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  const ref = useD3(
    (svg) => {
      const w = width  - margin.left - margin.right;
      const h = height - margin.top  - margin.bottom;

      const g = svg
        .attr('width',  width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      /* ── 스케일 ── */
      const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, w])
        .paddingInner(gap)   // 막대 사이 틈
        .paddingOuter(0);    // 양 끝 여백 없애기

      const yMax = 5.5;
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      /* ── 축 & 그리드 ── */
      g.append('g')
        .attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x));
      g.append('g')
        .call(d3.axisLeft(y).tickSize(-w))
        .selectAll('line')
        .attr('stroke', '#d0d0d0');

      /* ── 막대 (폭·좌표를 *그대로* 사용) ── */
      g.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.category))
        .attr('width', x.bandwidth())
        .attr('y', h)
        .attr('height', 0)
        .attr('fill', '#4b83c3')
        .transition()
        .duration(800)
        .attr('y', d => y(d.value))
        .attr('height', d => h - y(d.value));
    },
    [data, width, height, gap],
  );

  return <svg ref={ref} />;
}
