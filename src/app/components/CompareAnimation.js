"use client";
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import AgeGenderChart from "./AgeGenderChart";

export default function CompareAnimation({ csvUrl = "/data/kong_71.csv" }) {
  const host = useRef(null);
  const [step, setStep] = useState(0);
  const dur = 600;
  const facet = "65-69";

  const reset = () => {
    d3.select(host.current)
      .selectAll(".bar,.facet")
      .style("opacity", 1)
      .style("stroke", "none")
      .style("stroke-width", 0);
    d3.select(host.current).selectAll("text.delta").remove();
  };

  const focusFacet = () => {
    d3.select(host.current)
      .selectAll(".facet")
      .style("opacity", (d) => (d === facet ? 1 : 0.25));
  };

  const compareBars = () => {
    const bars = d3
      .select(host.current)
      .selectAll(".bar")
      .filter((d) => d["Age group"] === facet && ["Women", "Men"].includes(d.gender));

    const diff = Math.abs(bars.data()[0].Percentage - bars.data()[1].Percentage).toFixed(2);
    const winner =
      bars.data()[0].Percentage > bars.data()[1].Percentage ? bars.data()[0].gender : bars.data()[1].gender;

    bars
      .transition()
      .duration(dur / 2)
      .style("stroke", "#2563EB")
      .style("stroke-width", (d) => (d.gender === winner ? 4 : 2));

    const n1 = bars.nodes()[0];
    const n2 = bars.nodes()[1];
    const xMid =
      (+n1.getAttribute("x") + +n2.getAttribute("x") + +n1.getAttribute("width")) / 2;
    const yLabel =
      Math.min(+n1.getAttribute("y"), +n2.getAttribute("y")) - 10;

    d3.select(host.current)
      .append("text")
      .attr("class", "delta")
      .attr("x", xMid)
      .attr("y", yLabel)
      .attr("text-anchor", "middle")
      .attr("fill", "#2563EB")
      .attr("font-weight", 600)
      .text(`${winner} higher by ${diff} %`);
  };

  const next = () => {
    const s = (step + 1) % 3;
    setStep(s);
    if (s === 0) reset();
    else if (s === 1) focusFacet();
    else if (s === 2) compareBars();
  };

  useEffect(() => {
    if (host.current) reset();
  }, []);

  return (
    <section className="q-block">
      <h2 className="q-heading">
        Among 65-69, who feels more belonging, men or women, and by how much?
      </h2>
      <div ref={host} className="chartHost" />
      <AgeGenderChart csvUrl={csvUrl} mountRef={host} />
      <button type="button" className="replayBtn" onClick={next}>
        {step === 0 ? "Start" : "Next Step"}
      </button>
    </section>
  );
}
