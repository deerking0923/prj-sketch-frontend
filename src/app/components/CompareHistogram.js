'use client';
import React from 'react';
import { useD3 } from './useD3';
import * as d3 from 'd3';

/**
 * 1월·10월 막대 강조 + 가로선 + 값 어노테이션(x축 아래)
 */
export default function CompareHistogram({
  width  = 700,
  height = 400,
  data   = [],
  gap    = 0.03,
}) {
  const margin = { top: 20, right: 20, bottom: 65, left: 40 }; // 하단 공간 ↑
  const yMax   = 5.5;

  const hiColor = { Jan: 'orange', Oct: 'purple' };

  const ref = useD3(
    svg => {
      const w = width  - margin.left - margin.right;
      const h = height - margin.top  - margin.bottom;

      svg.attr('width', width).attr('height', height);
      const g    = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const grid = g.append('g');
      const bars = g.append('g');
      const anno = g.append('g');

      /* 스케일 */
      const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, w])
        .paddingInner(gap)
        .paddingOuter(0);
      const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

      /* 축 & 격자 */
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

      /* 막대 */
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
        .end()
        .then(drawAnnotations);

      /* 어노테이션 */
      function drawAnnotations() {
        const focus = data.filter(d => hiColor[d.category]);

        /* 가로선 */
        anno.selectAll('line.horiz')
          .data(focus)
          .join('line')
          .attr('class', 'horiz')
          .attr('x1', 0).attr('x2', w)
          .attr('y1', d => y(d.value))
          .attr('y2', d => y(d.value))
          .attr('stroke', d => hiColor[d.category])
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4 2');

        /* 값 숫자 – x축 라벨보다 아래로 */
        anno.selectAll('text.value')
          .data(focus)
          .join('text')
          .attr('class', 'value')
          .attr('x', d => x(d.category) + x.bandwidth() / 2)
          .attr('y', h + 30)                       // x축 아래 30px
          .attr('text-anchor', 'middle')
          .attr('font-weight', 'bold')
          .attr('fill', d => hiColor[d.category])
          .text(d => d.value.toFixed(2));          // "in" 제외
      }
    },
    [data, width, height, gap],
  );

  return <svg ref={ref} />;
}
