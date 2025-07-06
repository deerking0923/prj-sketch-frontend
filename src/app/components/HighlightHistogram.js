'use client';
import React from 'react';
import { useD3 } from './useD3';
import * as d3 from 'd3';
import { useTooltip } from './useTooltip';


/**
 * 최대·최소 막대를 주황색으로, 해당 달 레이블도 주황색·볼드 처리
 *
 * @prop gap             막대 간격(0~1, default 0.03)
 * @prop color           기본 막대 색 (default '#4b83c3')
 * @prop highlightColor  하이라이트 색 (default 'orange')
 */
export default function HighlightHistogram({
  width           = 700,
  height          = 400,
  data            = [],
  gap             = 0.03,
  color           = '#4b83c3',
  highlightColor  = 'orange',
}) {
  const tooltip = useTooltip();

  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const yMax = 5.5;                         /* ★ y축 상한 고정 */

  /* 최댓값·최솟값 달 찾기 */
  const maxVal  = d3.max(data, d => d.value);
  const minVal  = d3.min(data, d => d.value);
  const maxCats = data.filter(d => d.value === maxVal).map(d => d.category);
  const minCats = data.filter(d => d.value === minVal).map(d => d.category);

  const ref = useD3(
    svg => {
      const w = width  - margin.left - margin.right;
      const h = height - margin.top  - margin.bottom;

      const g = svg
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      /* 스케일 */
      const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, w])
        .paddingInner(gap)
        .paddingOuter(0);

      const y = d3.scaleLinear()
        .domain([0, yMax])
        .range([h, 0]);

      /* 축 & 그리드 */
      const xAxis = g.append('g')
        .attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x));

      // 달 레이블 하이라이트
      xAxis.selectAll('text')
        .each(function (d) {
          if (maxCats.includes(d) || minCats.includes(d)) {
            d3.select(this)
              .attr('fill', highlightColor)
              .attr('font-weight', 'bold');
          }
        });

      g.append('g')
        .call(d3.axisLeft(y).tickSize(-w))
        .selectAll('line')
        .attr('stroke', '#d0d0d0');

      /* 막대 */
      g.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.category))
        .attr('width', x.bandwidth())
        .attr('y', h)
        .attr('height', 0)
        .attr('fill', d =>
          maxCats.includes(d.category) || minCats.includes(d.category)
            ? highlightColor
            : color,
        )
        .on('pointerover', (event, d) =>
        tooltip.show(event, `<strong>${d.category}</strong>: ${d.value}`))
        .on('pointermove', (event, d) =>
        tooltip.show(event, `<strong>${d.category}</strong>: ${d.value}`))
        .on('pointerout', () => tooltip.hide()) 
        .transition()
        .duration(800)
        .attr('y', d => y(d.value))
        .attr('height', d => h - y(d.value));
    },
    [data, width, height, gap, color, highlightColor],
  );

  return <svg ref={ref} />;
}
