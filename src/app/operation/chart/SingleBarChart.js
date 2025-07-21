// src/app/operation/chart/SingleBarChart.js
"use client";

import  { useEffect, useImperativeHandle, forwardRef } from "react";
import * as d3 from "d3";

const SingleBarChart = forwardRef(({ csvUrl, mountRef, xField, yField }, ref) => {
  let svg, xScale, yScale;

  useEffect(() => {
    const host = d3.select(mountRef.current);
    host.selectAll("*").remove();

    // row로 단위(/km²) 제거하고 숫자 파싱
    d3.csv(csvUrl, row => {
      // xField는 그대로 두되
      const x = row[xField];
      // yField 에서 숫자 아닌 것(콤마, 단위)을 모두 날린 뒤 숫자로 변환
      const y = +row[yField].replace(/[^\d.-]/g, "");
      return { [xField]: x, [yField]: y };
    }).then((data) => {
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
      const g = svg.append("g")
        .attr("transform",`translate(${margin.left},${margin.top})`);

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
      const hl = "#ff6961";
      // 원래 색을 강제로 바꾸지 말고, 남겨둔 채로 하이라이트만 유지
      svg.selectAll(`rect[data-id='${key}']`)
        .transition().duration(duration)
          .attr("fill", hl)
        .end()
        .then(() => {
          // annotation 추가 (막대 위에 텍스트)
          const bar = svg.select(`rect[data-id='${key}']`);
          if (!bar.empty()) {
            const x = +bar.attr("x") + xScale.bandwidth()/2;
            const y = +bar.attr("y") - 5;
            svg.append("text")
              .attr("class", "annotation")
              .attr("x", x + margin.left)
              .attr("y", y + margin.top)
              .attr("text-anchor", "middle")
              .attr("font-size", 12)
              .attr("fill", hl)
              .text(key);
          }
        });
    }
  }));

  return null;
});

SingleBarChart.displayName = "SingleBarChart";
export default SingleBarChart;
