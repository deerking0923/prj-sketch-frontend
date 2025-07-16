// components/RetrieveValueAnimation.js
"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import AgeGenderChart from "./AgeGenderChart";
import "../style/ageChart.css";

export default function RetrieveValueAnimation({
  csvUrl = "/data/kong_71.csv",
}) {
  const host = useRef(null);
  const dur = 700;
  const target = { age: "70-74", gender: "Women" };

  /* ───── reset: 완전 원본 상태로 복구 ───── */
  const reset = () => {
    const root = d3.select(host.current);
    root.selectAll(".facet")
      .style("opacity", 1)
      .style("stroke", "none");
    root.selectAll(".bar")
      .style("stroke", "none")
      .style("stroke-width", 0);
    root.selectAll("text.value").remove();
  };

  /* ───── 애니메이션 한 번 재생 ───── */
  const run = () => {
    // 차트가 아직 안 그려졌으면 잠시 후 재시도
    const ready =
      d3
        .select(host.current)
        .selectAll(".bar")
        .filter(
          (d) => d["Age group"] === target.age && d.gender === target.gender,
        ).size() > 0;
    if (!ready) {
      setTimeout(run, 50);
      return;
    }

    reset(); // 원본 상태에서 출발

    /* 1) facet dimming + 테두리 */
    d3.select(host.current)
      .selectAll(".facet")
      .transition()
      .duration(dur / 2)
      .style("opacity", (d) => (d === target.age ? 1 : 0.25))
      .style("stroke", (d) => (d === target.age ? "#9CA3AF" : "none"))
      .style("stroke-width", (d) => (d === target.age ? 1.5 : 0));

    /* 2) bar 강조 */
    const barSel = d3
      .select(host.current)
      .selectAll(".bar")
      .filter(
        (d) => d["Age group"] === target.age && d.gender === target.gender,
      );

    barSel
      .raise()
      .transition()
      .delay(dur / 2)
      .duration(dur)
      .style("stroke", "#DC2626")
      .style("stroke-width", 4);

    /* 3) 값 라벨 */
    const n = barSel.node();
    const x = +n.getAttribute("x") + +n.getAttribute("width") / 2;
    const y = +n.getAttribute("y") - 8;
    const val = barSel.datum().Percentage;

    d3.select(host.current)
      .append("text")
      .attr("class", "value")
      .attr("x", x)
      .attr("y", y)
      .attr("text-anchor", "middle")
      .attr("fill", "#DC2626")
      .attr("opacity", 0)
      .text(`${val.toFixed(2)} %`)
      .transition()
      .delay(dur + dur / 2)
      .duration(dur / 3)
      .attr("opacity", 1);
  };

  /* 첫 로드: 원본 상태만 세팅 (애니메이션 자동 실행 X) */
  useEffect(() => {
    if (host.current) reset();
  }, []);

  return (
    <section className="q-block">
      <h2 className="q-heading">
        What percentage of women aged 70-74 feel they belong?
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
