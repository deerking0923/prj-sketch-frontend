"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../style/ageChart.css";

/**
 * AgeGenderChart
 * --------------
 * 정적 스몰멀티플 막대차트.
 * - csvUrl  : CSV 경로
 * - mountRef: 차트를 그려 넣을 div(부모 컴포넌트가 전달)
 */
export default function AgeGenderChart({
  csvUrl = "/data/kong_71.csv",
  mountRef,
}) {
  const localRef = useRef(null);
  const host = mountRef ?? localRef;

  useEffect(() => {
    // 이전 렌더링 정리
    d3.select(host.current).selectAll("*").remove();

    d3.csv(csvUrl, d3.autoType).then((data) => {
      const genders = ["Women", "Men", "All"];
      const ageGroups = Array.from(new Set(data.map((d) => d["Age group"])));

      /* 크기 설정 */
      const width = 900,
        height = 450,
        margin = { top: 40, right: 20, bottom: 30, left: 40 },
        facetW = (width - margin.left - margin.right) / ageGroups.length,
        facetH = height - margin.top - margin.bottom;

      /* 스케일 */
      const color = d3
        .scaleOrdinal()
        .domain(genders)
        .range(d3.schemeTableau10);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.Percentage)])
        .nice()
        .range([facetH, 0]);

      /* root svg */
      const svg = d3
        .select(host.current)
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("class", "svgCanvas");

      /* facet group */
      const facet = svg
        .selectAll(".facet")
        .data(ageGroups, (d) => d)
        .join("g")
        .attr("class", "facet")
        .attr("data-age", (d) => d) //  ← 애니메이션 훅에서 참조
        .attr(
          "transform",
          (d, i) => `translate(${margin.left + i * facetW},${margin.top})`,
        );

      /* facet title */
      facet
        .append("text")
        .attr("class", "facet-title")
        .attr("x", facetW / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text((d) => d);

      /* 막대 & 로컬 x축 */
      facet.each(function (age) {
        const g = d3.select(this);
        const subset = data.filter((d) => d["Age group"] === age);

        const x = d3
          .scaleBand()
          .domain(genders)
          .range([0, facetW - 10])
          .padding(0.25);

        g.append("g")
          .attr("transform", `translate(0,${facetH})`)
          .call(d3.axisBottom(x).tickSizeOuter(0));

        g.selectAll("rect")
          .data(subset)
          .join("rect")
          .attr("class", "bar")
          .attr("data-gender", (d) => d.gender) //  ← 훅에서 참조
          .attr("x", (d) => x(d.gender))
          .attr("y", (d) => y(d.Percentage))
          .attr("width", x.bandwidth())
          .attr("height", (d) => y(0) - y(d.Percentage))
          .attr("fill", (d) => color(d.gender));
      });

      /* 공유 y축 */
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(y).ticks(5))
        .call((g) => g.selectAll(".domain").remove());
    });
  }, [csvUrl, host]);

  return mountRef ? null : <div ref={localRef} className="chartHost" />;
}
