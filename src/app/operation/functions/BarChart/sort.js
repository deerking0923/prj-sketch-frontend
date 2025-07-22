import * as d3 from "d3";

/**
 * Sort Operation (막대 오름차순·내림차순 재배열)
 *
 * 1-1. 입력: chartContainer(DOM),
 *        params: { order: "asc"|"desc", duration }
 * 1-2. 출력: 같은 chartContainer DOM
 *
 * 예) runSort(dom, { order: "asc", duration: 800 });
 */
export function runSort(chartContainer, { order = "asc", duration = 600 }) {
  /* ── 선택기 ──────────────────────────── */
  const svg  = d3.select(chartContainer).select("svg");
  if (svg.empty()) return chartContainer;
  const bars = svg.selectAll("rect");

  /* ── 현재 x 좌표 배열 (왼→오 순) ───────── */
  const xPos = bars.nodes()
    .map(el => +el.getAttribute("x"))
    .sort((a, b) => a - b);

  /* ── 막대 값 정렬 (ASC/DESC) ──────────── */
  const sorted = bars.nodes().slice().sort((a, b) => {
    const va = parseFloat(a.getAttribute("data-value"));
    const vb = parseFloat(b.getAttribute("data-value"));
    return order === "asc" ? va - vb : vb - va;
  });

  /* ── 막대 애니메이션 ──────────────────── */
  sorted.forEach((node, idx) => {
    d3.select(node)
      .transition()
      .duration(duration)
      .attr("x", xPos[idx]);
  });

  /* ── 축 tick 텍스트 (있으면) 동기화 ──── */
  const ticks = svg.selectAll("g.tick");
  if (!ticks.empty()) {
    sorted.forEach((barNode, idx) => {
      const id = barNode.getAttribute("data-id");
      ticks
        .filter(function () { return d3.select(this).text() === id; })
        .transition()
        .duration(duration)
        .attr("transform", `translate(${xPos[idx]},0)`);
    });
  }

  return chartContainer;
}
