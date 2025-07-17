// src/app/operation/chart/SmallMultiplesChart.js
"use client";

import { useEffect } from "react";
import * as d3 from "d3";

export default function SmallMultiplesChart({
  csvUrl, mountRef, xField, seriesField, yField
}) {
  useEffect(() => {
    const host = d3.select(mountRef.current);
    host.selectAll("*").remove();

    d3.csv(csvUrl, d3.autoType).then(data => {
      const groups = Array.from(new Set(data.map(d => d[xField])));
      const series = Array.from(new Set(data.map(d => d[seriesField])));

      const margin = { top: 30, right: 10, bottom: 30, left: 40 };
      const width  = 600;
      const height = 300;
      const facetW = (width  - margin.left - margin.right) / groups.length;
      const facetH = (height - margin.top  - margin.bottom);

      const color = d3.scaleOrdinal()
        .domain(series)
        .range(d3.schemeTableau10);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yField])]).nice()
        .range([facetH, 0]);

      const svg = host.append("svg")
        .attr("viewBox", [0, 0, width, height]);

      // 각 그룹(facet) 그리기
      svg.selectAll("g.facet")
        .data(groups)
        .join("g")
          .attr("class", "facet")
          .attr("transform", (g,i) => `translate(${margin.left + i*facetW},${margin.top})`)
        .each(function(group){
          const gsel = d3.select(this);

          // title
          gsel.append("text")
            .attr("y", -6).attr("x", facetW/2)
            .attr("text-anchor","middle")
            .text(group);

          const subset = data.filter(d => d[xField] === group);

          const x = d3.scaleBand()
            .domain(series)
            .range([0, facetW])
            .padding(0.2);

          // x-axis
          gsel.append("g")
            .attr("transform", `translate(0,${facetH})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

          // bars
          gsel.selectAll("rect")
            .data(subset)
            .join("rect")
              .attr("class", "bar")
              .attr("data-age",    d => d[xField])
              .attr("data-gender", d => d[seriesField])
              .attr("data-value",  d => d[yField])
              .attr("x",      d => x(d[seriesField]))
              .attr("y",      d => y(d[yField]))
              .attr("width",  x.bandwidth())
              .attr("height", facetH - y(d => d[yField]))
              .attr("fill",   d => color(d[seriesField]));
        });

      // y-axis
      svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(y).ticks(5))
        .call(g => g.selectAll(".domain").remove());
    });
  }, [csvUrl, mountRef, xField, seriesField, yField]);

  return null;
}
