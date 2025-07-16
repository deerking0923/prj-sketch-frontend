"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import AgeGenderChart from "./AgeGenderChart";

export default function SortAnimation({ csvUrl = "/data/kong_71.csv" }) {
  const host = useRef(null);
  const [step, setStep] = useState(0);
  const dur = 800;

  const reset = () => {
    d3.select(host.current)
      .selectAll(".facet")
      .transition()
      .duration(dur / 2)
      .attr("transform", (d, i) => {
        // original order (assumes page loaded order)
        const x = 40 + i * 140;
        return `translate(${x},40)`;
      });
    d3.select(host.current).selectAll("text.rank").remove();
  };

  const sortFacets = () => {
    const data = d3
      .select(host.current)
      .selectAll(".bar")
      .filter((d) => d.gender === "Women")
      .data();

    const sorted = [...data].sort(
      (a, b) => d3.descending(a.Percentage, b.Percentage),
    );
    const order = sorted.map((d) => d["Age group"]);

    d3.select(host.current)
      .selectAll(".facet")
      .transition()
      .duration(dur)
      .attr("transform", (d) => {
        const newIdx = order.indexOf(d);
        const x = 40 + newIdx * 140;
        return `translate(${x},40)`;
      });

    // rank label
    d3.select(host.current)
      .selectAll(".facet")
      .append("text")
      .attr("class", "rank")
      .attr("x", 0)
      .attr("y", -20)
      .attr("fill", "#DB2777") // fuchsia-600
      .attr("font-weight", 700)
      .text((d) => `#${order.indexOf(d) + 1}`);
  };

  const next = () => {
    const s = (step + 1) % 2;
    setStep(s);
    if (s === 0) reset();
    else if (s === 1) sortFacets();
  };

  useEffect(() => {
    if (host.current) reset();
  }, []);

  return (
    <section className="q-block">
      <h2 className="q-heading">
        Rank age groups by women’s percentage (descending)
      </h2>
      <div ref={host} className="chartHost" />
      <AgeGenderChart csvUrl={csvUrl} mountRef={host} />
      <button type="button" className="replayBtn" onClick={next}>
        {step === 0 ? "Start" : "Sort"}
      </button>
    </section>
  );
}
