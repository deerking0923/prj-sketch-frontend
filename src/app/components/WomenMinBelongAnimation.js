"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import AgeGenderChart from "./AgeGenderChart";
import "../style/ageChart.css";

/**
 * WomenMinBelongAnimation – 4-step demo
 * 0) Reset → 1) Women bars only → 2) Highlight lowest bar (orange fill)
 * 3) Draw red dashed guideline + label
 */
export default function WomenMinBelongAnimation({
  csvUrl = "/data/kong_71.csv",
}) {
  const host   = useRef(null);
  const minRef = useRef(null);          // 최소 여성 데이터
  const [step, setStep] = useState(0);  // 0-3
  const dur = 800;

  /* ───── Reset ───── */
  const reset = () => {
    const root = d3.select(host.current);
    root.selectAll(".bar,.facet")
      .style("opacity", 1)
      .style("stroke", "none")
      .style("stroke-width", 0)
      .style("fill", null);            // ★ 강조색 복구
    root.selectAll("g.anno,text.highlight,line.anno-line").remove();
    minRef.current = null;
  };

  /* ───── Step 1: Women only ───── */
  const womenOnly = () => {
    d3.select(host.current)
      .selectAll(".bar")
      .transition().duration(dur)
      .style("opacity", d => (d.gender === "Women" ? 1 : 0.15));
  };

  /* ───── Step 2: Highlight min (orange fill) ───── */
  const highlightMin = () => {
    const root = d3.select(host.current);
    const womenBars = root.selectAll(".bar").filter(d => d.gender === "Women");

    const minDatum = womenBars.data()
      .reduce((a, c) => (c.Percentage < a.Percentage ? c : a));

    minRef.current = minDatum;

    // 모든 여성 막대 살짝 흐림
    // womenBars
    //   .transition().duration(dur / 2)
    //   .style("opacity", d => (d === minDatum ? 1 : 0.4));

    // 최소 막대 주황색으로
    womenBars
      .filter(d => d === minDatum)
      .transition().duration(dur / 2)
      .style("fill", "#F97316");   // orange-500
  };

  /* ───── Step 3: Guideline + label ───── */
  const annotate = () => {
    if (!minRef.current) return;

    const root = d3.select(host.current);
    const svg  = root.select("svg");
    const minBar = root.selectAll(".bar").filter(d => d === minRef.current);

    // 절대 Y 좌표 계산
    const barNode  = minBar.node();
    const barYLoc  = +barNode.getAttribute("y");
    const facetG   = barNode.parentNode;
    const transStr = facetG.getAttribute("transform") || "translate(0,0)";
    const m        = transStr.match(/translate\(\s*[\d.]+\s*[ ,]\s*([\d.]+)/);
    const facetY   = m ? +m[1] : 0;
    const barYAbs  = facetY + barYLoc;

    const svgW = svg.node().viewBox?.baseVal?.width || +svg.attr("width") || 900;

    // 점선
    svg.append("line")
      .attr("class", "anno-line")
      .attr("x1", 0)
      .attr("x2", svgW)
      .attr("y1", barYAbs)
      .attr("y2", barYAbs)
      .attr("stroke", "#DC2626")
      .attr("stroke-width", 2.5)
      .attr("stroke-dasharray", "4 2")
      .attr("opacity", 0)
      .transition().duration(dur / 2)
      .attr("opacity", 1);

    // 라벨
    svg.append("text")
      .attr("class", "highlight")
      .attr("x", svgW / 2)
      .attr("y", Math.max(barYAbs - 10, 12))
      .attr("text-anchor", "middle")
      .attr("fill", "#DC2626")
      .attr("font-weight", 700)
      .attr("font-size", 13)
      .attr("opacity", 0)
      .text(`${minRef.current.Percentage.toFixed(2)} %  (Lowest)`)
      .transition().duration(dur / 2)
      .attr("opacity", 1);
  };

  /* ───── Step advance ───── */
  const advance = () => {
    const next = (step + 1) % 4;  // 0→1→2→3→0
    setStep(next);

    if (next === 0) reset();
    else if (next === 1) womenOnly();
    else if (next === 2) highlightMin();
    else if (next === 3) annotate();
  };

  /* mount: 초기 reset */
  useEffect(() => {
    if (host.current) reset();
  }, []);

  return (
    <section className="q-block">
      <h2 className="q-heading">
        Step {step} / 3 – What is the lowest percentage of women that feel they
        belong in the neighborhood?
      </h2>

      <div ref={host} className="chartHost" style={{ position: "relative" }} />
      <AgeGenderChart csvUrl={csvUrl} mountRef={host} />

      <button type="button" className="replayBtn" onClick={advance}>
        {step === 0 ? "Start" : "Next Step"}
      </button>
    </section>
  );
}
