import * as d3 from "d3";

/**
 * 1-1. 입력: chartContainer(DOM), params: { op, value, duration }
 * 1-2. 출력: 같은 chartContainer DOM
 */
export function runFilter(
  chartContainer,
  { op = ">=", value, duration = 600 }
) {
  const matchColor = "#ffa500";
  const dimOpacity = 0.15;
  const origColor  = "#69b3a2";

  const svg  = d3.select(chartContainer).select("svg");
  if (svg.empty()) return chartContainer;

  const bars = svg.selectAll("rect");

  /* 초기화 */
  bars.interrupt()
      .attr("fill", origColor)
      .attr("opacity", 1)
      .attr("stroke", "none");

  svg.selectAll(".annotation, .filter-label").remove();

  /* 조건 판별 */
  const satisfy = {
    ">":  (a, b) => a >  b,
    ">=": (a, b) => a >= b,
    "<":  (a, b) => a <  b,
    "<=": (a, b) => a <= b,
    "==": (a, b) => a === b,
  }[op] ?? (() => true);

  /* 애니메이션 */
  bars.each(function () {
    const node = d3.select(this);
    const val  = +node.attr("data-value");
    const pass = satisfy(val, value);

    node.transition()
        .duration(duration)
        .attr("fill", pass ? matchColor : origColor)
        .attr("opacity", pass ? 1 : dimOpacity);
  });

  /* 라벨 */
  svg.append("text")
     .attr("class", "filter-label")
     .attr("x", 8)
     .attr("y", 14)
     .attr("font-size", 12)
     .attr("fill", matchColor)
     .text(`Filter: value ${op} ${value}`);

  return chartContainer;
}
