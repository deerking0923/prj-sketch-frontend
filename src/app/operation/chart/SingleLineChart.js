"use client";

import { useEffect } from "react";
import * as d3 from "d3";

export default function SingleLineChart({
  csvUrl,
  mountRef,
  xField,
  yField,
}) {
  useEffect(() => {
    const host = d3.select(mountRef.current);
    host.selectAll("*").remove();            // 초기화

    d3.csv(csvUrl, d3.autoType).then((data) => {
      const margin = { top: 40, right: 20, bottom: 60, left: 60 },
            width  = 640,
            height = 320,
            plotW  = width - margin.left - margin.right,
            plotH  = height - margin.top - margin.bottom;

      const x = d3
        .scalePoint()
        .domain(data.map((d) => d[xField]))
        .range([0, plotW]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[yField])])
        .nice()
        .range([plotH, 0]);

      const svg = host
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("data-m-left", margin.left)    // ★ margin.x 보존 → retrieveValue에서 사용
        .attr("data-m-top", margin.top);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // 라인
      const lineGen = d3
        .line()
        .x((d) => x(d[xField]))
        .y((d) => y(d[yField]));

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#5B8FF9")
        .attr("stroke-width", 2)
        .attr("d", lineGen);

      // 데이터 포인트
      g.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d) => x(d[xField]))
        .attr("cy", (d) => y(d[yField]))
        .attr("r", 4)
        .attr("fill", "#5B8FF9")
        .attr("data-id", (d) => d[xField])   // year 값 보존
        .attr("data-value", (d) => d[yField]);

      // 축
      g.append("g")
        .attr("transform", `translate(0,${plotH})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

      g.append("g").call(d3.axisLeft(y).ticks(5));
    });
  }, [csvUrl, mountRef, xField, yField]);

  return null; // DOM은 D3가 직접 그린다
}
