// SortAnimation.js
"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import AgeGenderChart from "./AgeGenderChart";
import "../style/ageChart.css";

export default function SortAnimation({ csvUrl = "/data/kong_71.csv" }) {
  const host = useRef(null);

  /* ---- 타이밍 파라미터 ---- */
  const dur       = 2400;  // 전체 애니메이션(페이드 + 정렬) 2.4s
  const viewDelay = 1000;  // '원본 차트'를 보여 줄 시간 1.0s
  const left      = 20;    // AgeGenderChart의 margin.left
  const step      = 100;   // 파셋 간격

  /* ─ reset: 원래 위치 + 막대 복구 ─ */
  const reset = () => {
    const root = d3.select(host.current);

    root.selectAll(".facet")
        .interrupt()                            // 진행 중 transition 중단
        .attr("transform", (d, i) => `translate(${left + i * step},40)`);

    root.selectAll(".bar")
        .interrupt()
        .style("opacity", 1);

    root.selectAll("text.rank").remove();
  };

  /* ─ run: viewDelay → 페이드 → 정렬 ─ */
  const run = () => {
    const root = d3.select(host.current);
    const bars = root.selectAll(".bar");
    if (bars.empty()) { setTimeout(run, 50); return; }

    reset();  // ➊ 원본 차트 복구

    /* ➋ 잠시 그대로 두기 */
    setTimeout(() => {

      /* 1단계: 남성 막대만 남기고 페이드 */
      bars.transition()
          .duration(dur / 2)                    // 1.2s
          .style("opacity", d => d.gender === "Men" ? 1 : 0);

      /* 2단계: 1단계 끝난 뒤 정렬 */
      setTimeout(() => {
        const menVals = {};
        bars.filter(d => d.gender === "Men")
            .each(d => { menVals[d["Age group"]] = d.Percentage; });

        const order = Object.entries(menVals)
          .sort(([, a], [, b]) => d3.descending(a, b))
          .map(([k]) => k);

        root.selectAll(".facet")
          .transition().duration(dur / 2).ease(d3.easeCubicInOut)  // 1.2s
          .attr("transform", d => {
            const idx = order.indexOf(d);
            return `translate(${left + idx * step},40)`;
          })
          .each(function(d) {
            /* 랭크 라벨 */
            const facet = d3.select(this);
            facet.select("text.rank").remove();

            facet.append("text")
              .attr("class", "rank")
              .attr("x", 0)
              .attr("y", -22)
              .attr("fill", "#3B82F6")
              .attr("font-weight", 700)
              .attr("opacity", 0)
              .text(`#${order.indexOf(d) + 1}`)
              .transition().duration(dur / 2)
              .attr("opacity", 1);
          });

      }, dur / 2);   // 1단계(페이드)가 끝난 뒤

    }, viewDelay);   // viewDelay 동안 원본 노출
  };

  /* mount 시 기본 차트만 그려두기 */
  useEffect(() => { if (host.current) reset(); }, []);

  return (
    <section className="q-block">
      <h2 className="q-heading">
        Rank age groups by men’s percentage&nbsp;(descending)
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
