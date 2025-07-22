import * as d3 from "d3";

/**
 * 1-1. 입력: chartContainer(DOM), params: { op, value, duration }
 * 1-2. 출력: 같은 chartContainer DOM (애니메이션 완료 후)
 */
export function runFilter(chartContainer, { op = ">=", value, duration = 600 }) {
  const matchColor = "#ffd54f";
  const dimOpacity = 0.15;
  const origColor  = "#5B8FF9";

  const svg = d3.select(chartContainer).select("svg");
  if (svg.empty()) return chartContainer;

  const circles = svg.selectAll("circle");

  /* ─── ① 공통 리셋 ───────────────────────────── */
  circles
    .interrupt()
    .attr("fill", origColor)
    .attr("r", 4)
    .attr("opacity", 1)
    .attr("stroke", "none");

  svg.selectAll(".annotation, .filter-label").remove();
  /* ──────────────────────────────────────────── */

  /* ─── ② 조건 판별 & 애니메이션 ─────────────── */
  const satisfy = {
    ">":  (a, b) => a >  b,
    ">=": (a, b) => a >= b,
    "<":  (a, b) => a <  b,
    "<=": (a, b) => a <= b,
    "==": (a, b) => a === b,
  }[op] ?? (() => true);

  circles.each(function () {
    const node = d3.select(this);
    const id   = +node.attr("data-id");
    const pass = satisfy(id, value);

    node.transition()
      .duration(duration)
      .attr("fill", pass ? matchColor : origColor)
      .attr("opacity", pass ? 1 : dimOpacity)
      .attr("r", pass ? 6 : 4);
  });

  /* ─── ③ 필터 라벨 ──────────────────────────── */
  svg.append("text")
    .attr("class", "filter-label")
    .attr("x", 8)
    .attr("y", 14)
    .attr("font-size", 12)
    .attr("fill", matchColor)
    .text(`Filter: year ${op} ${value}`);

  return chartContainer;
}
