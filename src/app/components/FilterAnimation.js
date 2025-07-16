"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import AgeGenderChart from "./AgeGenderChart";
import "../style/ageChart.css";

export default function FilterAnimation({ csvUrl = "/data/kong_71.csv" }) {
  const host = useRef(null);
  const dur = 800;
  const threshold = 70; // %

  /* ─ reset ─ */
  const reset = () => {
    const root = d3.select(host.current);
    root.selectAll(".bar")
      .style("opacity", 1)
      .style("stroke", "none")
      .style("stroke-width", 0);
    root.selectAll("text.filter-label").remove();
  };

  /* ─ animation ─ */
  const run = () => {
    const bars = d3.select(host.current).selectAll(".bar");
    if (bars.empty()) {
      setTimeout(run, 50);
      return;
    }

    reset();

    /* 1) dim everything */
    bars
      .transition().duration(dur / 3)
      .style("opacity", 0.2);

    /* 2) target bars (Men < 70) */
    const target = bars.filter(
      d => d.gender === "Men" && d.Percentage < threshold,
    );

    target
      .raise()
      .transition()
      .delay(dur / 3)
      .duration(dur)
      .style("opacity", 1)
      .style("stroke", "#DC2626")
      .style("stroke-width", 3);

    /* 3) value label directly above each bar (in same facet group) */
    target.each(function (d) {
      const bar = d3.select(this);
      const x = +bar.attr("x") + +bar.attr("width") / 2;
      const y = +bar.attr("y") - 8;

      d3.select(this.parentNode)          // facet <g>
        .append("text")
        .attr("class", "filter-label")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("fill", "#DC2626")
        .attr("font-weight", 600)
        .attr("opacity", 0)
        .text(`${d.Percentage.toFixed(2)} %`)
        .transition()
        .delay(dur)
        .duration(dur / 3)
        .attr("opacity", 1);
    });
  };

  useEffect(() => {
    if (host.current) reset();
  }, []);

  return (
    <section className="q-block">
      <h2 className="q-heading">
        Show only age groups where men’s percentage &lt; 70 %
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
