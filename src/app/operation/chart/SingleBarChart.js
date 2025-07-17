// src/app/operation/chart/SingleBarChart.jsx
"use client";

import { useEffect, useImperativeHandle, forwardRef } from "react";
import * as d3 from "d3";

/**
 * 2) 단일 바 전용 차트 + 리플레이 함수
 */
const SingleBarChart = forwardRef(({ csvUrl, mountRef, xField, yField }, ref) => {
  let svg, xScale, yScale;

  useEffect(() => {
    const host = d3.select(mountRef.current);
    host.selectAll("*").remove();

    d3.csv(csvUrl, d3.autoType).then((data) => {
      const margin = { top: 40, right: 20, bottom: 80, left: 60 },
            width  = 600, height = 300,
            plotW  = width - margin.left - margin.right,
            plotH  = height - margin.top - margin.bottom;

      xScale = d3.scaleBand()
        .domain(data.map(d => d[xField]))
        .range([0, plotW])
        .padding(0.2);

      yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yField])]).nice()
        .range([plotH, 0]);

      svg = host.append("svg").attr("viewBox",[0,0,width,height]);
      const g = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

      // x축
      g.append("g")
        .attr("transform",`translate(0,${plotH})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
          .attr("transform","rotate(-45)")
          .style("text-anchor","end");

      // y축
      g.append("g").call(d3.axisLeft(yScale).ticks(5));

      // 막대
      g.selectAll("rect")
        .data(data).join("rect")
          .attr("x", d => xScale(d[xField]))
          .attr("y", d => yScale(d[yField]))
          .attr("width", xScale.bandwidth())
          .attr("height", d => plotH - yScale(d[yField]))
          .attr("fill", "#69b3a2")
          .attr("data-id", d => d[xField]);
    });
  }, [csvUrl, mountRef, xField, yField]);

  // 리플레이 메서드
  useImperativeHandle(ref, () => ({
    replay({ key, duration=600 }) {
      const hl = "#ff6961", orig = "#69b3a2";
      svg.selectAll(`rect[data-id='${key}']`)
        .transition().duration(duration/2)
          .attr("fill", hl)
        .transition().duration(duration/2)
          .attr("fill", orig);
    }
  }));
// SingleBarChart.js 맨 아래
SingleBarChart.displayName = "SingleBarChart";

  return null;
});

export default SingleBarChart;
