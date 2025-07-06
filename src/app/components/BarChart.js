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

      // 최상위 <g>
      const g = svg
        .attr('width',  width)
        .attr('height', height)
        .style('border', '1px solid lightgray')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // 스케일
      const x = d3.scaleBand()
        .domain(data.map((d) => d.category))
        .range([0, innerW])
        .padding(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([innerH, 0]);

      // 축
      g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x));

      g.append('g').call(d3.axisLeft(y));

      // 막대
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
            .call((sel) =>
              sel
                .transition()
                .duration(800)
                .attr('y', (d) => y(d.value))
                .attr('height', (d) => innerH - y(d.value)),
            ),
        );

      // 평균선
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
    },
    [data, width, height, showAverage],
  );

  return <svg ref={ref} />;
}
