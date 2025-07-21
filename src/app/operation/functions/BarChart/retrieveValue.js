// src/app/operation/functions/BarChart/retrieveValue.js
import * as d3 from "d3";

/**
 * 1-1. 입력: chartContainer (DOM), params: { key, duration }
 * 1-2. 출력: 같은 chartContainer DOM (애니메이션이 끝난 후)
 */
export function runRetrieveValue(chartContainer, { key, duration = 600 }) {
  const hlColor  = "#ff6961";
  const origColor = "#69b3a2";

  // d3 선택기 생성
  const svg  = d3.select(chartContainer).select("svg");
  const bars = svg.selectAll("rect");

  // 1) 다른 모든 바들 원래 상태로 리셋
  bars
    .transition()
    .duration(300)
    .attr("fill", origColor)
    .attr("stroke", "none")
    .attr("transform", "scale(1,1)");

  // 2) key에 해당하는 바만 하이라이트
  const target = bars.filter(function () {
    return d3.select(this).attr("data-id") === key;
  });

  target
    .transition()
    .duration(duration / 2)
    .attr("fill", hlColor)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("transform", "scale(1.05,1.05)")
    .transition()
    .duration(duration / 2)
    .attr("transform", "scale(1,1)");

  // 3) 업데이트된 DOM 컨테이너 반환
  return chartContainer;
}
