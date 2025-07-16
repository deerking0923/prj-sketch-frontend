// components/ExtremumAnimation.js
"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import AgeGenderChart from "./AgeGenderChart";
import "../style/ageChart.css";

export default function ExtremumAnimation({ csvUrl = "/data/kong_71.csv" }) {
  const host = useRef(null);
  const dur = 700;

  /* reset → 원본 차트 */
  const reset = () => {
    const root = d3.select(host.current);
    root.selectAll(".bar")
      .style("opacity", 1)
      .style("fill", null)
      .style("stroke", "none");
    root.selectAll("text.highlight").remove();
  };

  /* 한 번 재생 */
  const run = () => {
    const bars = d3.select(host.current).selectAll(".bar");
    if (bars.empty()) { setTimeout(run, 50); return; } // 차트 준비 대기

    reset();

    /* 1) 'All' 외 dim */
    bars
      .transition().duration(dur / 2)
      .style("opacity", d => (d.gender === "All" ? 1 : 0.2));

    /* 2) 최고값 찾기 */
    const allBars = bars.filter(d => d.gender === "All");
    const maxDatum = d3.max(allBars.data(), d => d.Percentage);
    const maxBar = allBars.filter(d => d.Percentage === maxDatum);

    /* 3) 막대 강조 */
    maxBar
      .raise()
      .transition()
      .delay(dur / 2)
      .duration(dur / 2)
      .style("fill", "#22C55E")
      .style("stroke", "#15803D")
      .style("stroke-width", 3);

    /* 4) 값 라벨 (facet 그룹 내부에 추가) */
    maxBar.each(function (d) {
      const bar = d3.select(this);
      const g   = d3.select(this.parentNode);     // facet <g>
      const x   = +bar.attr("x") + +bar.attr("width") / 2;
      const y   = +bar.attr("y") - 8;

      g.append("text")
        .attr("class", "highlight")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("fill", "#22C55E")
        .attr("font-weight", 600)
        .attr("opacity", 0)
        .text(`${d.Percentage.toFixed(2)} % (Highest)`)
        .transition()
        .delay(dur)
        .duration(dur / 3)
        .attr("opacity", 1);
    });
  };

  /* 초기: 원본만 */
  useEffect(() => { if (host.current) reset(); }, []);

  return (
    <section className="q-block">
      <h2 className="q-heading">
        Which age group has the highest overall (“All”) percentage?
      </h2>

      <div ref={host} className="chartHost" />
      <AgeGenderChart csvUrl={csvUrl} mountRef={host} />

      <button
        type="button"
        className="replayBtn"
        style={{ marginTop: "0.75rem" }}
        onClick={run}
      >
        Replay
      </button>
    </section>
  );
}
