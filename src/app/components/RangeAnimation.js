// components/RangeAnimation.js
"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import AgeGenderChart from "./AgeGenderChart";
import "../style/ageChart.css";

export default function RangeAnimation({ csvUrl = "/data/kong_71.csv" }) {
  const host = useRef(null);
  const dur = 700;
  const color = "#F59E0B";         // amber-500

  /* ───── 원본 상태 복구 ───── */
  const reset = () => {
    const root = d3.select(host.current);
    root.selectAll(".bar")
      .style("opacity", 1)
      .style("stroke", "none");
    root.selectAll("line.range,text.range").remove();
  };

  /* ───── 절대 y좌표 헬퍼 ───── */
  const absY = (node) => {
    const localY = +node.getAttribute("y");
    const g      = node.parentNode;                     // facet <g>
    const t      = g.getAttribute("transform") || "translate(0,0)";
    const m      = t.match(/translate\([^,]+[, ]\s*([\d.]+)/);
    const facY   = m ? +m[1] : 0;
    return facY + localY;
  };

  /* ───── 애니메이션 ───── */
  const run = () => {
    const bars = d3.select(host.current).selectAll(".bar");
    if (bars.empty()) { setTimeout(run, 50); return; }   // 차트 준비 대기

    reset();

    /* 1) 남성 막대 외 dim */
    bars.transition().duration(dur / 2)
        .style("opacity", d => (d.gender === "Men" ? 1 : 0.2));

    /* 2) 남성 막대 min / max 찾기 */
    const menBars = bars.filter(d => d.gender === "Men");
    const minDatum = d3.min(menBars.data(), d => d.Percentage);
    const maxDatum = d3.max(menBars.data(), d => d.Percentage);

    const minNode = menBars.filter(d => d.Percentage === minDatum).node();
    const maxNode = menBars.filter(d => d.Percentage === maxDatum).node();

    const yMin = absY(minNode);  // 최저 막대 y
    const yMax = absY(maxNode);  // 최고 막대 y

    /* 3) 점선 & 라벨 */
    const svg   = d3.select(host.current).select("svg");
    const viewW = svg.node().viewBox?.baseVal?.width || +svg.attr("width") || 900;

    [yMax, yMin].forEach((yPos) => {
      svg.append("line")
        .attr("class", "range")
        .attr("x1", 0).attr("x2", viewW)
        .attr("y1", yPos).attr("y2", yPos)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4 2")
        .attr("opacity", 0)
        .transition().delay(dur/2).duration(dur/2)
        .attr("opacity", 1);
    });

    svg.append("text")
      .attr("class", "range")
      .attr("x", viewW / 2)
      .attr("y", yMax - 10)                 // 윗선 바로 위
      .attr("text-anchor", "middle")
      .attr("fill", color)
      .attr("font-weight", 600)
      .attr("opacity", 0)
      .text(`Range ${minDatum.toFixed(2)} – ${maxDatum.toFixed(2)} %`)
      .transition().delay(dur/2).duration(dur/2)
      .attr("opacity", 1);
  };

  /* 첫 로드: 원본 차트만 보여줌 */
  useEffect(() => {
    if (host.current) reset();
  }, []);

  return (
    <section className="q-block">
      <h2 className="q-heading">
        What is the range of percentages for men across all age groups?
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
