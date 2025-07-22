import * as d3 from "d3";

/**
 * Find Extremum Operation (최댓값·최솟값 강조)
 *
 * 1-1. 입력: chartContainer(DOM), params: { type = "max"|"min", duration }
 * 1-2. 출력: 같은 chartContainer DOM (애니메이션 완료 후)
 *
 * 예) runFindExtremum(dom, { type: "min", duration: 800 });
 */
export function runFindExtremum(
  chartContainer,
  { type = "max", duration = 600 }
) {
  const hlColor  = "#a65dfb";      // 보라색 하이라이트
  const origColor = "#69b3a2";
  const svg  = d3.select(chartContainer).select("svg");
  if (svg.empty()) return chartContainer;

  const marginL = +svg.attr("data-m-left") || 0;
  const marginT = +svg.attr("data-m-top")  || 0;

  const bars = svg.selectAll("rect");

  /* ─── 초기화 ───────────────────────────────────────────── */
  bars.interrupt()
      .attr("fill", origColor)
      .attr("stroke", "none")
      .attr("opacity", 1);
  svg.selectAll(".annotation, .filter-label").remove();

  /* ─── 극값 계산 ─────────────────────────────────────────── */
  const values = bars.nodes().map(el => +el.getAttribute("data-value"));
  const extremeVal = type === "min" ? d3.min(values) : d3.max(values);

  const target = bars.filter(function () {
    return +this.getAttribute("data-value") === extremeVal;
  });

  /* ─── 강조 애니메이션 ──────────────────────────────────── */
  target.transition()
        .duration(duration)
        .attr("fill", hlColor)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

  /* ─── 라벨(막대 위) ───────────────────────────────────── */
  const node = target.node();
  if (node) {
    const x = +node.getAttribute("x") + (+node.getAttribute("width") / 2) + marginL;
    const y = +node.getAttribute("y") - 6 + marginT;
    const label = `${type === "min" ? "Min" : "Max"}: ${extremeVal}`;

    svg.append("text")
       .attr("class", "annotation")
       .attr("x", x)
       .attr("y", y)
       .attr("text-anchor", "middle")
       .attr("font-size", 12)
       .attr("fill", hlColor)
       .text(label);
  }

  return chartContainer;
}
