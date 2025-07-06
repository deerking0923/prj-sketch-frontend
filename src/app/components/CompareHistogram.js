'use client';
import React from 'react';
import { useD3 } from './useD3';
import * as d3 from 'd3';

/**
 * 1월·10월을 주황/보라색으로 하이라이트,
 *   • 가로선(전체 폭) – 막대 위
 *   • 숫자 어노테이션 – 막대 위
 */
export default function CompareHistogram({
  width  = 700,
  height = 400,
  data   = [],
  gap    = 0.03,
}) {
  const margin = { top: 20, right: 20, bottom: 50, left: 40 };
  const yMax   = 5.5;                        // y축 상한 고정

  /* 하이라이트 대상 & 색상 */
  const hiColor = { Jan: 'orange', Oct: 'purple' };

  const ref = useD3(
    svg => {
      const w = width  - margin.left - margin.right;
      const h = height - margin.top  - margin.bottom;

      /* 레이어: grid ⭣ bar ⭣ anno  (append 순서 = z-index) */
      svg.attr('width', width).attr('height', height);
      const g    = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const grid = g.append('g').attr('class', 'grid');           // 맨뒤
      const bars = g.append('g').attr('class', 'bars');           // 가운데
      const anno = g.append('g').attr('class', 'annotations');    // 맨앞

      /* 스케일 */
      const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, w])
        .paddingInner(gap)
        .paddingOuter(0);

      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      /* 축 + 회색 격자 (grid 레이어) */
      grid.append('g')
        .call(d3.axisLeft(y).tickSize(-w))
        .selectAll('line')
        .attr('stroke', '#d0d0d0');

      const xAxis = g.append('g')
        .attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x));

      xAxis.selectAll('text')
        .each(function (d) {
          if (hiColor[d]) {
            d3.select(this).attr('fill', hiColor[d]).attr('font-weight', 'bold');
          }
        });

      /* 막대 (bars 레이어) */
      bars.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.category))
        .attr('width', x.bandwidth())
        .attr('y', h)
        .attr('height', 0)
        .attr('fill', d => hiColor[d.category] ?? '#4b83c3')
        .transition()
        .duration(800)
        .attr('y', d => y(d.value))
        .attr('height', d => h - y(d.value))
        .end()                                 // 애니 끝난 뒤 어노테이션 그리기
        .then(() => drawAnnotations());

      /* 어노테이션 + 하이라이트 선 */
      function drawAnnotations() {
        const focus = data.filter(d => hiColor[d.category]);

        /* 가로선 */
        anno.selectAll('line')
          .data(focus)
          .join('line')
          .attr('x1', 0).attr('x2', w)
          .attr('y1', d => y(d.value))
          .attr('y2', d => y(d.value))
          .attr('stroke', d => hiColor[d.category])
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4 2');

        /* 값 텍스트 */
        anno.selectAll('text')
          .data(focus)
          .join('text')
          .attr('x', d => x(d.category) + x.bandwidth() / 2)
          .attr('y', d => y(d.value) - 8)
          .attr('text-anchor', 'middle')
          .attr('font-weight', 'bold')
          .attr('fill', d => hiColor[d.category])
          .text(d => d.value.toFixed(2) + ' in');
      }
    },
    [data, width, height, gap],
  );

  return <svg ref={ref} />;
}
