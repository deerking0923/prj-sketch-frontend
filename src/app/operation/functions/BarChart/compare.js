import * as d3 from "d3";

/**
 * Compare Operation
 * 두 막대를 지정해 값 차이를 시각적으로 강조하고, 차이값을 텍스트로 표시한다.
 *
 * 1-1. 입력: chartContainer(DOM),
 *        params: { keyA, keyB, duration }
 * 1-2. 출력: chartContainer DOM
 *
 * 예) runCompare(dom, { keyA: "BBC Radio 4", keyB: "BBC Local Radio" });
 */
export function runCompare(
  chartContainer,
  { keyA, keyB, duration = 600 }
) {
  const colorA     = "#2196f3";   // 파랑
  const colorB     = "#ff9800";   // 주황
  const dimOpacity = 0.15;
  const origColor  = "#69b3a2";

  const svg  = d3.select(chartContainer).select("svg");
  if (svg.empty()) return chartContainer;

  const marginL = +svg.attr("data-m-left") || 0;
  const marginT = +svg.attr("data-m-top")  || 0;

  const bars = svg.selectAll("rect");

  /* ── 초기화 ───────────────────────────────────────────── */
  bars.interrupt()
      .attr("fill", origColor)
      .attr("opacity", 1)
      .attr("stroke", "none");

  svg.selectAll(".annotation, .filter-label, .range-line, .compare-line")
     .remove();

  /* ── 두 타깃 막대 선택 ───────────────────────────────── */
  const targetA = bars.filter(function () {
    return d3.select(this).attr("data-id") === keyA;
  });
  const targetB = bars.filter(function () {
    return d3.select(this).attr("data-id") === keyB;
  });

  /* ── 나머지 막대 반투명 ──────────────────────────────── */
  bars.filter(function () {
    const id = d3.select(this).attr("data-id");
    return id !== keyA && id !== keyB;
  })
  .transition()
  .duration(duration)
  .attr("opacity", dimOpacity);

  /* ── 타깃 막대 색상 변경 ─────────────────────────────── */
  targetA.transition().duration(duration).attr("fill", colorA);
  targetB.transition().duration(duration).attr("fill", colorB);

  /* ── 차이선 + 텍스트 주석 ───────────────────────────── */
  const nodeA = targetA.node();
  const nodeB = targetB.node();
  if (nodeA && nodeB) {
    // 좌표 계산
    const cxA = +nodeA.getAttribute("x") + (+nodeA.getAttribute("width") / 2) + marginL;
    const cyA = +nodeA.getAttribute("y") + marginT;
    const cxB = +nodeB.getAttribute("x") + (+nodeB.getAttribute("width") / 2) + marginL;
    const cyB = +nodeB.getAttribute("y") + marginT;

    const yLine = Math.min(cyA, cyB) - 10;   // 두 막대 중 더 높은 곳 위 10px
    const diff  = Math.abs(
      parseFloat(nodeA.getAttribute("data-value")) -
      parseFloat(nodeB.getAttribute("data-value"))
    ).toFixed(1);

    // 연결 선
    svg.append("line")
       .attr("class", "compare-line")
       .attr("x1", cxA)
       .attr("y1", yLine)
       .attr("x2", cxB)
       .attr("y2", yLine)
       .attr("stroke", "#555")
       .attr("stroke-width", 1.5)
       .attr("marker-end", "url(#arrow)")
       .attr("marker-start", "url(#arrow)");

    // 화살표 마커(defs에 1회만 추가)
    if (svg.select("defs#compare-defs").empty()) {
      const defs = svg.append("defs").attr("id", "compare-defs");
      defs.append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 5)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
        .append("path")
          .attr("d", "M 0 0 L 10 5 L 0 10 z")
          .attr("fill", "#555");
    }

    // 차이값 텍스트
    svg.append("text")
       .attr("class", "annotation")
       .attr("x", (cxA + cxB) / 2)
       .attr("y", yLine - 6)
       .attr("text-anchor", "middle")
       .attr("font-size", 12)
       .attr("fill", "#555")
       .text(`Δ ${diff}`);
  }

  return chartContainer;
}
