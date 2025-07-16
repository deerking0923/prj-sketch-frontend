// SortAnimation.js
"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import AgeGenderChart from "./AgeGenderChart";
import "../style/ageChart.css";

export default function SortAnimation({ csvUrl = "/data/kong_71.csv" }) {
  const host = useRef(null);
  const dur = 800; // Total duration for animations
  const left = 20; // AgeGenderChart margin.left - Adjusted
  const step = 100; // Facet width - Adjusted

  /* ─ reset: Restore original position + all bars ─ */
  const reset = () => {
    const root = d3.select(host.current);
    root.selectAll(".facet")
      .transition().duration(dur / 3)
      .attr("transform", (d, i) => `translate(${left + i * step},40)`);
    root.selectAll(".bar")
      .style("opacity", 1);
    root.selectAll("text.rank").remove(); // Ensure existing ranks are removed
  };

  /* ─ run: 2-phase animation ─ */
  const run = () => {
    const root = d3.select(host.current);
    const bars = root.selectAll(".bar");
    if (bars.empty()) {
      setTimeout(run, 50);
      return;
    }

    reset(); // Start with a clean state

    /* 1) Keep only men's bars, fade out others */
    bars.transition()
      .duration(dur / 2)
      .style("opacity", d => d.gender === "Men" ? 1 : 0);

    /* 2) facet reorder after 0.5*dur */
    setTimeout(() => {
      // 남성 값 배열 수집
      const menVals = {};
      bars.filter(d => d.gender === "Men")
        .each(d => {
          menVals[d["Age group"]] = d.Percentage;
        });

      const order = Object.entries(menVals)
        .sort(([, a], [, b]) => d3.descending(a, b))
        .map(([k]) => k); // 내림차순 Age group 리스트

      // 이동 + 랭크 라벨
      root.selectAll(".facet")
        .transition().duration(dur / 2).ease(d3.easeCubicInOut)
        .attr("transform", d => {
          const idx = order.indexOf(d);
          return `translate(${left + idx * step},40)`;
        });

      // Append rank labels to each facet directly, then transition their opacity
      root.selectAll(".facet")
        .each(function(d) {
          const currentFacet = d3.select(this);
          // Remove any existing rank labels to prevent duplicates on rerun
          currentFacet.select("text.rank").remove();

          currentFacet.append("text")
            .attr("class", "rank")
            .attr("x", 0)
            .attr("y", -22)
            .attr("fill", "#3B82F6") // blue-500
            .attr("font-weight", 700)
            .attr("opacity", 0) // Start invisible
            .text(() => `#${order.indexOf(d) + 1}`) // Use a function for text content
            .transition().duration(dur / 2)
            .attr("opacity", 1); // Fade in
        });

    }, dur / 2);
  };

  /* mount: pristine */
  useEffect(() => {
    if (host.current) reset();
  }, []);

  return (
    <section className="q-block">
      <h2 className="q-heading">
        Rank age groups by men’s percentage (descending)
      </h2>

      <div ref={host} className="chartHost" />
      {/* Pass an additional prop to AgeGenderChart to indicate we only want "Men" data displayed initially */}
      <AgeGenderChart csvUrl={csvUrl} mountRef={host} displayGender={"Men"} />

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