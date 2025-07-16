"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import AgeGenderChart from "./AgeGenderChart";
import "../style/ageChart.css";

export default function CompareAnimation({ csvUrl = "/data/kong_71.csv" }) {
  const host     = useRef(null);
  const infoBox  = useRef(null);           // 오른쪽 비율 표기
  const facet    = "65-69";
  const dur      = 700;
  const red      = "#DC2626";

  /* ─ reset ─ */
  const reset = () => {
    const root = d3.select(host.current);
    root.selectAll(".facet")
        .style("opacity", 1)
        .style("stroke", "none");
    root.selectAll(".bar")
        .style("opacity", 1)
        .style("stroke", "none")
        .style("stroke-width", 0);
    root.selectAll("text.delta").remove();
    if (infoBox.current) infoBox.current.textContent = "";
  };

  /* ─ run ─ */
  const run = () => {
    const root = d3.select(host.current);
    const bars = root.selectAll(".bar");
    if (bars.empty()) { setTimeout(run, 50); return; }

    reset();

    /* 1) facet dimming */
    root.selectAll(".facet")
      .transition().duration(dur/2)
      .style("opacity", d => (d === facet ? 1 : 0.25));

    /* 2) Women/Men bars in facet */
    const pair = bars.filter(d =>
      d["Age group"] === facet && ["Women","Men"].includes(d.gender)
    );
    const allBar = bars.filter(d =>
      d["Age group"] === facet && d.gender === "All"
    );

    // dim 'All' bar in same facet
    allBar.transition().duration(dur/2).style("opacity",0.2);

    /* compute diff */
    const [dw, dm] = pair.data()[0].gender === "Women" ? pair.data() : pair.data().reverse();
    const diff = (dw.Percentage - dm.Percentage).toFixed(2);

    /* 3) highlight bars */
    pair.raise()
        .transition().delay(dur/2).duration(dur/2)
        .style("stroke", d => (d.gender === "Women" ? red : "#4B5563"))
        .style("stroke-width", d => (d.gender === "Women" ? 4 : 2));

    /* 4) central Δ label */
    const nW = pair.filter(d=>d.gender==="Women").node();
    const nM = pair.filter(d=>d.gender==="Men").node();
    const xMid = (+nW.getAttribute("x") + +nM.getAttribute("x") + +nW.getAttribute("width"))/2;
    const yTop = Math.min(+nW.getAttribute("y"), +nM.getAttribute("y")) - 12;

    d3.select(nW.parentNode)     // facet group
      .append("text")
      .attr("class","delta")
      .attr("x", xMid)
      .attr("y", yTop)
      .attr("text-anchor","middle")
      .attr("fill", red)
      .attr("font-weight",700)
      .attr("opacity",0)
      .text(`Women higher by ${diff} %`)
      .transition().delay(dur).duration(dur/3)
      .attr("opacity",1);

    /* 5) side panel info */
    if (infoBox.current) {
      infoBox.current.innerHTML =
        `<strong>Women:</strong> ${dw.Percentage.toFixed(2)} %<br/>
         <strong>Men:</strong> ${dm.Percentage.toFixed(2)} %`;
    }
  };

  /* mount → pristine */
  useEffect(() => { if (host.current) reset(); }, []);

  return (
    <section className="q-block" style={{display:"flex",gap:"1.5rem"}}>
      <div style={{flex:1}}>
        <h2 className="q-heading">
          Among 65-69, who feels more belonging, men or women, and by how much?
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
      </div>

      {/* 오른쪽 정보 패널 */}
      <aside
        ref={infoBox}
        style={{
          minWidth:"160px",
          alignSelf:"center",
          fontSize:"0.95rem",
          lineHeight:1.4
        }}
      />
    </section>
  );
}
