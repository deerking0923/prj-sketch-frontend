import * as d3 from "d3";

/**
 * 1-1. 입력: chartContainer(DOM), params: { key, duration }
 * 1-2. 출력: 같은 chartContainer DOM (애니메이션 완료 후)
 */
export function runRetrieveValue(chartContainer, { key, duration = 600 }) {
  const hlColor   = "#ff6961";
  const origColor = "#5B8FF9";

  const svg = d3.select(chartContainer).select("svg");
  if (svg.empty()) return chartContainer;

  const circles = svg.selectAll("circle");
  const marginL = +svg.attr("data-m-left") || 0;
  const marginT = +svg.attr("data-m-top")  || 0;

  /* ─── ① 공통 리셋 ───────────────────────────── */
  circles
    .interrupt()                               // 진행 중인 transition 중단
    .attr("fill", origColor)
    .attr("r", 4)
    .attr("opacity", 1)
    .attr("stroke", "none");

  svg.selectAll(".annotation, .filter-label").remove();
  /* ──────────────────────────────────────────── */

  /* ─── ② key(year) 포인트 강조 ─────────────── */
  const target = circles.filter(function () {
    return +d3.select(this).attr("data-id") === +key;
  });

  target
    .transition()
    .duration(duration / 2)
    .attr("r", 7)
    .attr("fill", hlColor)
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .transition()
    .duration(duration / 2)
    .attr("r", 6);

  /* ─── ③ 값 어노테이션 추가 ────────────────── */
  const node = target.node();
  if (node) {
    const cx = +node.getAttribute("cx") + marginL;
    const cy = +node.getAttribute("cy") + marginT - 10;
    const val = node.getAttribute("data-value");

    svg.append("text")
      .attr("class", "annotation")
      .attr("x", cx)
      .attr("y", cy)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("fill", hlColor)
      .text(`${key}: ${val}`);
  }

  return chartContainer;
}
