import * as d3 from "d3";

export function runRetrieveValue(chartContainer, { key, duration = 600 }) {
  const hlColor  = "#ff6961";
  const origColor = "#69b3a2";

  const svg  = d3.select(chartContainer).select("svg");
  if (svg.empty()) return chartContainer;

  const marginL = +svg.attr("data-m-left") || 0;
  const marginT = +svg.attr("data-m-top")  || 0;

  const bars = svg.selectAll("rect");

  /* 초기화 */
  bars.interrupt()
      .attr("fill", origColor)
      .attr("stroke", "none")
      .attr("opacity", 1);

  svg.selectAll(".annotation, .filter-label").remove();

  /* ▶︎ BUG FIX: function() { …this… } 로 교체 */
  const target = bars.filter(function () {
    return d3.select(this).attr("data-id") === key;
  });

  target.transition()
        .duration(duration)
        .attr("fill", hlColor)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

  const bar = target.node();          // 이제 실제 SVGRectElement
  if (bar) {
    const x = +bar.getAttribute("x") + (+bar.getAttribute("width") / 2) + marginL;
    const y = +bar.getAttribute("y") - 6 + marginT;

    svg.append("text")
       .attr("class", "annotation")
       .attr("x", x)
       .attr("y", y)
       .attr("text-anchor", "middle")
       .attr("font-size", 12)
       .attr("fill", hlColor)
       .text(key);
  }

  return chartContainer;
}
