// src/app/components/RankHistogram.js
'use client';
import React from 'react';
import { useD3 } from './useD3';
import * as d3 from 'd3';

export default function RankHistogram({
  width  = 700,
  height = 400,
  data   = [],
  gap    = 0.03,
}) {
  const margin = { top: 20, right: 20, bottom: 65, left: 40 }; // ↓ 하단 공간 확대
  const yMax   = 5.5;

  /* ── 상반기 1‒3위 산출 ── */
  const firstHalf    = data.slice(0, 6);                           // Jan‒Jun
  const top3         = [...firstHalf].sort((a, b) => b.value - a.value).slice(0, 3);
  const ranks = {};                                               // {Mar:1, Jan:2, Feb:3}
  top3.forEach((d, i) => (ranks[d.category] = i + 1));
  const firstHalfSet = new Set(firstHalf.map(d => d.category));

  /* 색 */
  const blue  = '#4b83c3';
  const orange = 'orange';
  const grey  = '#c0c0c0';

  const ref = useD3(
    svg => {
      const w = width  - margin.left - margin.right;
      const h = height - margin.top  - margin.bottom;

      svg.attr('width', width).attr('height', height);
      const root = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const grid = root.append('g');
      const bars = root.append('g');
      const anno = root.append('g');

      /* 스케일 */
      const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, w])
        .paddingInner(gap)
        .paddingOuter(0);

      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      /* 격자 & y축 */
      grid.append('g')
        .call(d3.axisLeft(y).tickSize(-w))
        .selectAll('line')
        .attr('stroke', '#d0d0d0');

      /* x축 */
      const xAxis = root.append('g')
        .attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x));

      /* x축 레이블 색상 (3위 주황) */
      xAxis.selectAll('text')
        .each(function (d) {
          if (ranks[d]) {
            d3.select(this)
              .attr('fill', ranks[d] === 3 ? orange : blue)
              .attr('font-weight', 'bold');
          }
        });

      /* 막대 */
      bars.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.category))
        .attr('width', x.bandwidth())
        .attr('y', h)
        .attr('height', 0)
        .attr('fill', d => {
          if (firstHalfSet.has(d.category)) {
            return ranks[d.category] === 3 ? orange : blue;
          }
          return grey;                                        // Jul‒Dec
        })
        .transition()
        .duration(800)
        .attr('y', d => y(d.value))
        .attr('height', d => h - y(d.value))
        .end()
        .then(addAnnotations);

      /* 어노테이션 */
      function addAnnotations() {
        const focus = data.filter(d => ranks[d.category]);    // 1·2·3위

        /* 순위 숫자 (3은 주황) */
        anno.selectAll('text.rank')
          .data(focus)
          .join('text')
          .attr('class', 'rank')
          .attr('x', d => x(d.category) + x.bandwidth() / 2)
          .attr('y', d => y(d.value) - 12)
          .attr('text-anchor', 'middle')
          .attr('font-weight', 'bold')
          .attr('fill', d => (ranks[d.category] === 3 ? orange : blue))
          .text(d => ranks[d.category]);

        /* 가로 점선 (y축 → 막대 끝) */
        anno.selectAll('line.horiz')
          .data(focus)
          .join('line')
          .attr('class', 'horiz')
          .attr('x1', 0)
          .attr('x2', d => x(d.category) + x.bandwidth())
          .attr('y1', d => y(d.value))
          .attr('y2', d => y(d.value))
          .attr('stroke', d => (ranks[d.category] === 3 ? orange : blue))
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4 2');

        /* 3위 값 숫자 – x축 아래 */
        const third = focus.find(d => ranks[d.category] === 3);
        if (third) {
          anno.append('text')
            .attr('x', x(third.category) + x.bandwidth() / 2)
            .attr('y', h + 32)                               // x라벨 아래로 더 내림
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .attr('fill', orange)
            .text(third.value.toFixed(2));                   // "in" 제거
        }
      }
    },
    [data, width, height, gap],
  );

  return <svg ref={ref} />;
}
