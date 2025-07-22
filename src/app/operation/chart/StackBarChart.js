"use client";

import { useEffect, forwardRef, useImperativeHandle } from "react";
import * as d3 from "d3";

const StackBarChart = forwardRef(({
  mountRef,
  csvUrl,
  xField,
  seriesField,
  yField
}, ref) => {
  let svg, keys, xScale, yScale;

  useEffect(() => {
    if (!mountRef.current) return;
    const host = d3.select(mountRef.current);
    host.selectAll("*").remove();

    d3.csv(csvUrl, d3.autoType).then(data => {
      // 1) pivot
      const grouped = d3.groups(data, d => d[xField]);
      const processed = grouped.map(([key, vals]) => {
        const obj = { [xField]: key };
        vals.forEach(v => obj[v[seriesField]] = v[yField]);
        return obj;
      });

      // 2) keys
      keys = Array.from(new Set(data.map(d => d[seriesField])));

      // 3) stack
      const stackGen = d3.stack().keys(keys);
      const series  = stackGen(processed);

      // 4) dims
      const margin = { top: 20, right: 20, bottom: 60, left: 50 },
            width  = 600, height = 300,
            plotW  = width - margin.left - margin.right,
            plotH  = height - margin.top - margin.bottom;

      // 5) scales
      xScale = d3.scaleBand()
        .domain(processed.map(d => d[xField]))
        .range([0, plotW])
        .padding(0.2);

      yScale = d3.scaleLinear()
        .domain([0, d3.max(processed, d => 
           keys.reduce((sum, k) => sum + (d[k]||0), 0)
        )])
        .nice()
        .range([plotH, 0]);

      const color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeTableau10);

      // 6) svg
      svg = host.append("svg")
        .attr("viewBox", [0, 0, width, height]);

      // ← 여기서 config를 반드시 저장합니다!
      svg.node().__chartConfig = { xField, seriesField, yField };

      // 7) group
      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("g")
        .attr("transform", `translate(0,${plotH})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

      g.append("g")
        .call(d3.axisLeft(yScale));

      // 8) bars
      const layer = g.selectAll("g.layer")
        .data(series).join("g")
          .attr("class", "layer")
          .attr("fill", d => color(d.key));

      layer.selectAll("rect")
        .data(d => d)
        .join("rect")
          .attr("class", "bar-seg")
          .attr("data-id", d => `${d.data[xField]}|${d.key}`)
          .attr("x",      d => xScale(d.data[xField]))
          .attr("y",      d => yScale(d[1]))
          .attr("height", d => yScale(d[0]) - yScale(d[1]))
          .attr("width",  xScale.bandwidth());
    });
  }, [mountRef, csvUrl, xField, seriesField, yField]);

  useImperativeHandle(ref, () => ({
    // 필요하시면 여기에 API 노출
  }), []);

  return null;
});
StackBarChart.displayName = "StackBarChart";
export default StackBarChart;
