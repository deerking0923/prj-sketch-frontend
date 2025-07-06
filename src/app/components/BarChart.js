// src/app/components/BarChart.js
'use client';
import React from 'react';
import { useD3 } from './useD3';
import * as d3 from 'd3';

export default function BarChart({
  width        = 500,
  height       = 300,
  data         = [],
  showAverage  = true,
}) {
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  const ref = useD3(
    (svg) => {
      const innerW = width  - margin.left - margin.right;
      const innerH = height - margin.top  - margin.bottom;

      /* ───────────────────────────── 툴팁 DOM 생성 ─────────────────────────── */
      const tooltip = d3
        .select('body')                  // 필요하면 컨테이너 ref로 변경 가능
        .append('div')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('padding', '4px 8px')
        .style('background', 'rgba(0,0,0,0.75)')
        .style('color', '#fff')
        .style('border-radius', '4px')
        .style('font', '12px sans-serif')
        .style('opacity', 0);

      /* ─────────────────────────── SVG & 스케일 설정 ──────────────────────── */
      const g = svg
        .attr('width',  width)
        .attr('height', height)
        .style('border', '1px solid lightgray')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .domain(data.map((d) => d.category))
        .range([0, innerW])
        .padding(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([innerH, 0]);

      g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x));
      g.append('g').call(d3.axisLeft(y));

      /* ────────────────────────────── 막대 + 이벤트 ───────────────────────── */
      g.selectAll('rect')
        .data(data)
        .join((enter) =>
          enter
            .append('rect')
            .attr('x', (d) => x(d.category))
            .attr('width', x.bandwidth())
            .attr('y', innerH)
            .attr('height', 0)
            .attr('fill', 'orange')
            .on('pointerover', function (event, d) {
              d3.select(this).attr('fill', '#ff9800');
              tooltip
                .style('opacity', 1)
                .html(`<strong>${d.category}</strong>: ${d.value}`);
            })
            .on('pointermove', function (event) {
              tooltip
                .style('left', event.pageX + 12 + 'px')
                .style('top', event.pageY - 28 + 'px');
            })
            .on('pointerout', function () {
              d3.select(this).attr('fill', 'orange');
              tooltip.style('opacity', 0);
            })
            // ▽ 애니메이션은 마지막에
            .call((sel) =>
              sel
                .transition()
                .duration(800)
                .attr('y', (d) => y(d.value))
                .attr('height', (d) => innerH - y(d.value)),
            ),
        );

      /* ───────────────────────── 평균선(옵션) ─────────────────────────────── */
      if (showAverage) {
        const avg = d3.mean(data, (d) => d.value);
        g.append('line')
          .attr('x1', 0)
          .attr('x2', innerW)
          .attr('y1', y(avg))
          .attr('y2', y(avg))
          .attr('stroke', 'dodgerblue')
          .attr('stroke-dasharray', '4 2');

        g.append('text')
          .attr('x', innerW - 4)
          .attr('y', y(avg) - 6)
          .attr('text-anchor', 'end')
          .attr('fill', 'dodgerblue')
          .attr('font-weight', 'bold')
          .text(`평균 ${avg.toFixed(1)}`);
      }

      /* ─────────────────────────── cleanup ──────────────────────────────── */
      return () => {
        tooltip.remove();            // 툴팁 제거
      };
    },
    [data, width, height, showAverage],
  );

  return <svg ref={ref} />;
}
