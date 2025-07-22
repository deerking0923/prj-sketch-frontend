"use client";

import { useEffect, useImperativeHandle, forwardRef } from "react";
import * as d3 from "d3";

const SingleBarChart = forwardRef(({ csvUrl, mountRef, xField, yField }, ref) => {
  let svg, xScale, yScale;

  useEffect(() => {
    const host = d3.select(mountRef.current);
    host.selectAll("*").remove();

    d3.csv(csvUrl, row => {
      const x = row[xField];
      const y = +row[yField].replace(/[^\d.-]/g, "");
      return { [xField]: x, [yField]: y };
    }).then(data => {
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

      svg = host.append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("data-m-left", margin.left)
      .attr("data-m-top", margin.top);
      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("g")
        .attr("transform", `translate(0,${plotH})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

      g.append("g").call(d3.axisLeft(yScale).ticks(5));

      g.selectAll("rect")
        .data(data).join("rect")
          .attr("x", d => xScale(d[xField]))
          .attr("y", d => yScale(d[yField]))
          .attr("width",  xScale.bandwidth())
          .attr("height", d => plotH - yScale(d[yField]))
          .attr("fill",   "#69b3a2")
          .attr("data-id", d => d[xField])
          .attr("data-value", d => d[yField]);   // y 값 보존
    });
  }, [csvUrl, mountRef, xField, yField]);

  /* replay 메서드는 현재 페이지에서 사용하지 않지만
     혹시 모를 호출에 대비해 확대 효과를 제거 */
  useImperativeHandle(ref, () => ({
    replay({ key, duration = 600 }) {
      const hl = "#ff6961";
      svg.selectAll(`rect[data-id='${key}']`)
        .transition().duration(duration)
        .attr("fill", hl);
    },
  }));

  return null;
});

SingleBarChart.displayName = "SingleBarChart";
export default SingleBarChart;
