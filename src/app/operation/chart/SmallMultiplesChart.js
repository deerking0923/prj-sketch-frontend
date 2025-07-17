"use client";

import { useEffect } from "react";
import * as d3 from "d3";
import "../../style/ageChart.css";  // 기존 스타일 그대로 쓰셔도 됩니다

/**
 * 범용 막대 스몰멀티플 차트
 *
 * Props:
 *  - csvUrl     : 데이터 CSV 경로
 *  - mountRef   : 이 차트를 붙일 div 레퍼런스
 *  - xField     : X축 그룹 필드명 (e.g. "Age group" or "Service")
 *  - seriesField: 각각의 서브 막대를 구분할 필드명 (e.g. "gender" or "Comparison with 2011/12 (£million)")
 *  - yField     : Y축 값 필드명 (e.g. "Percentage" or "2012/13 Total Cost (£million)")
 */
export default function UniversalBarChart({
  csvUrl,
  mountRef,
  xField,
  seriesField,
  yField,
}) {
  useEffect(() => {
    const host = d3.select(mountRef.current);
    host.selectAll("*").remove();

    d3.csv(csvUrl, d3.autoType).then((data) => {
      const series = Array.from(new Set(data.map(d => d[seriesField])));
      const groups = Array.from(new Set(data.map(d => d[xField])));

      const margin = { top: 40, right: 20, bottom: 30, left: 40 };
      const width  = 600;
      const height = 300;
      const facetW = (width - margin.left - margin.right) / groups.length;
      const facetH = height - margin.top - margin.bottom;

      const color = d3.scaleOrdinal()
        .domain(series)
        .range(d3.schemeTableau10);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yField])]).nice()
        .range([facetH, 0]);

      const svg = host.append("svg")
        .attr("viewBox", [0, 0, width, height]);

      const facet = svg.selectAll(".facet")
        .data(groups, d => d)
        .join("g")
        .attr("class", "facet")
        .attr("data-group", d => d)
        .attr("transform", (d,i) => `translate(${margin.left + i*facetW},${margin.top})`);

      // facet 제목
      facet.append("text")
        .attr("class","facet-title")
        .attr("x", facetW/2)
        .attr("y",-10)
        .attr("text-anchor","middle")
        .text(d => d);

      facet.each(function(group){
        const g = d3.select(this);
        const subset = data.filter(d => d[xField] === group);

        const x = d3.scaleBand()
          .domain(series)
          .range([0, facetW-10])
          .padding(0.25);

        // x축
        g.append("g")
          .attr("transform",`translate(0,${facetH})`)
          .call(d3.axisBottom(x).tickSizeOuter(0));

        // 막대
        g.selectAll("rect")
          .data(subset)
          .join("rect")
          .attr("class","bar")
          .attr("data-series", d => d[seriesField])
          .attr("x", d => x(d[seriesField]))
          .attr("y", d => y(d[yField]))
          .attr("width", x.bandwidth())
          .attr("height", d => facetH - y(d[yField]))
          .attr("fill", d => color(d[seriesField]));
      });

      // y축
      svg.append("g")
        .attr("transform",`translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(y).ticks(5))
        .call(g => g.selectAll(".domain").remove());
    });
  }, [csvUrl, mountRef, xField, seriesField, yField]);

  // mountRef 로 그려주기 때문에 내부 div는 비워둡니다
  return null;
}
