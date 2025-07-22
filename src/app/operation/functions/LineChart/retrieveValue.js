import * as d3 from "d3";

/**
 * 1-1. 입력: chartContainer(DOM), params: { key, duration }
 * 1-2. 출력: 같은 chartContainer DOM (애니메이션 완료 후)
 */
export function runRetrieveValue(chartContainer, { key, duration = 600 }) {
  const hlColor   = "#ff6961";
  const origColor = "#5B8FF9";

  const svg     = d3.select(chartContainer).select("svg");
  const circles = svg.selectAll("circle");
  const marginL = +svg.attr("data-m-left") || 0;
  const marginT = +svg.attr("data-m-top")  || 0;

  // 1) 모든 포인트 초기화 & 기존 annotation 제거
  circles
    .transition()
    .duration(300)
    .attr("r", 4)
    .attr("fill", origColor)
    .attr("stroke", "none");

  svg.selectAll(".annotation").remove();

  // 2) key(year)에 해당하는 포인트 하이라이트
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

  // 3) 값 어노테이션(text) 추가
  const node = target.node();
  if (node) {
    const cx     = +d3.select(node).attr("cx") + marginL;
    const cy     = +d3.select(node).attr("cy") + marginT - 10;
    const revenue = d3.select(node).attr("data-value");

    svg.append("text")
      .attr("class", "annotation")
      .attr("x", cx)
      .attr("y", cy)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("fill", hlColor)
      .text(`${key}: ${revenue}`);
  }

  // 4) 최종 DOM 반환
  return chartContainer;
}
