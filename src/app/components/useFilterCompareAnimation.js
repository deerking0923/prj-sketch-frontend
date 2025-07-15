"use client";

import { useEffect, useCallback } from "react";
import * as d3 from "d3";

/**
 * useFilterCompareAnimation
 * -------------------------
 * Animates Filter(Age) → Filter(Gender) → Retrieve+Compare.
 * Winner bar gets strong highlight; Δ‑label sits a bit higher.
 */
export default function useFilterCompareAnimation({ ref }) {
  const facetAge = "All aged 16 and over";
  const dur = 800;

  /* ---------- reset chart to pristine ---------- */
  const reset = useCallback(() => {
    if (!ref.current) return;
    const root = d3.select(ref.current);

    root.selectAll(".facet")
      .style("opacity", 1)
      .style("stroke", "none");

    root.selectAll(".bar")
      .style("opacity", 1)
      .style("stroke", "none")
      .style("stroke-width", 0)
      .style("fill", null);

    root.selectAll("text.value, text.delta").remove();
  }, [ref]);

  /* ---------- run 3‑step pipeline ---------- */
  const run = useCallback(() => {
    const root = d3.select(ref.current);
    const facets = root.selectAll(".facet");
    if (facets.size() === 0) return; // chart not ready yet

    const targetFacet = facets.filter((d) => d === facetAge);

    /* ① Age Filter */
    facets
      .transition()
      .duration(dur)
      .style("opacity", (d) => (d === facetAge ? 1 : 0.25))
      .style("stroke", (d) => (d === facetAge ? "#9CA3AF" : "none"))
      .style("stroke-width", (d) => (d === facetAge ? 1.5 : 0));

    /* ② Gender Filter */
    setTimeout(() => {
      targetFacet
        .selectAll(".bar")
        .transition()
        .duration(dur)
        .style("opacity", (d) => (d.gender === "All" ? 0.12 : 1));
    }, dur + 60);

    /* ③ Retrieve & Compare */
    setTimeout(() => {
      const barsSel = targetFacet
        .selectAll(".bar")
        .filter((d) => ["Women", "Men"].includes(d.gender));

      const bars = barsSel.data().flat();
      const maxVal = d3.max(bars, (d) => d.Percentage);
      const winner = bars.find((d) => d.Percentage === maxVal).gender;
      const diff = Math.abs(bars[0].Percentage - bars[1].Percentage);

      /* 값 라벨 */
      barsSel.each(function (d) {
        const bar = d3.select(this);
        const xMid = +bar.attr("x") + +bar.attr("width") / 2;
        const yTop = +bar.attr("y") - 8;

        targetFacet
          .append("text")
          .attr("class", "value")
          .attr("x", xMid)
          .attr("y", yTop)
          .attr("text-anchor", "middle")
          .attr("font-size", 12)
          .attr("opacity", 0)
          .text(`${d3.format(".2f")(d.Percentage)}%`)
          .transition()
          .duration(dur / 2)
          .attr("opacity", 1);
      });

      /* 승자 하이라이트: 진한 파란 Fill + 굵은 Stroke */
      barsSel
        .transition()
        .duration(dur / 2)
        .style("fill", (d) => (d.gender === winner ? "#2563EB" : null))
        .style("stroke", (d) => (d.gender === winner ? "#1E40AF" : "none"))
        .style("stroke-width", (d) => (d.gender === winner ? 3.5 : 0));

      /* Δ 라벨 위치 계산 (더 위로) */
      const [b1Node, b2Node] = barsSel.nodes();
      const y1 = +d3.select(b1Node).attr("y");
      const y2 = +d3.select(b2Node).attr("y");
      const x1 = +d3.select(b1Node).attr("x") + +d3.select(b1Node).attr("width") / 2;
      const x2 = +d3.select(b2Node).attr("x") + +d3.select(b2Node).attr("width") / 2;
      const xMid = (x1 + x2) / 2;
      const yLabel = Math.max(Math.min(y1, y2) - 35, 12); // 35px 위, 상단 최소 12px

      targetFacet
        .append("text")
        .attr("class", "delta")
        .attr("x", xMid)
        .attr("y", yLabel)
        .attr("text-anchor", "middle")
        .attr("font-size", 13)
        .attr("fill", winner === "Women" ? "#2563EB" : "#000")
        .attr("opacity", 0)
        .text(`${winner} higher by ${diff.toFixed(2)}%`)
        .transition()
        .duration(dur / 2)
        .attr("opacity", 1);
    }, dur * 2 + 120);
  }, [ref]);

  /* ─────────────── 자동 실행 (mount) ─────────────── */
  useEffect(() => {
    if (!ref.current) return;
    reset();
    const t = setTimeout(run, 60); // slight delay until SVG ready
    return () => clearTimeout(t);
  }, [ref, reset, run]);

  /* replay for button */
  const replay = useCallback(() => {
    reset();
    run();
  }, [reset, run]);

  return { replay };
}