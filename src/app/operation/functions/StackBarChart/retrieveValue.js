// src/app/functions/StackBarChart/retrieveValue.js
import * as d3 from "d3";

/**
 * 차트 위에 특정 바 하나를 강조/확대하고 값을 표시합니다.
 *
 * @param {HTMLElement} chartHost  - d3.select(chartDivRef.current).node() 같은 컨테이너 엘리먼트
 * @param {Object} options
 * @param {string} options.category - xField 값 중 강조할 카테고리 (ex. "Muslims")
 * @param {string} options.series   - seriesField 값 중 강조할 시리즈 (ex. "Growing")
 * @param {number} options.duration - 전체 애니메이션 기간 (ms)
 */
export function runRetrieveValue(chartHost, {
  category,
  series,
  duration = 800
}) {
  const svgEl = d3.select(chartHost).select("svg").node();
  if (!svgEl) return;

  // 1) 스택바차트 생성 시 저장해둔 config 꺼내오기
  const cfg = svgEl.__chartConfig;
  if (!cfg) return;
  const { xField, yField } = cfg;

  const half = duration / 2;
  const fade = 0.25;
  const svg  = d3.select(svgEl);

  // --- 초기화: 인터럽트, 스타일 원복, 기존 값 텍스트 제거 ---
  svg.selectAll(".layer").interrupt()
    .style("opacity", 1)
    .style("stroke", "none");

  svg.selectAll(".bar-seg").interrupt()
    .style("stroke", "none")
    .style("stroke-width", 0)
    .attr("transform", "scale(1,1)");

  svg.selectAll("text.__val__").remove();

  // --- 1) 다른 레이어 반투명, 타겟 레이어 테두리 강조 ---
  svg.selectAll(".layer")
    .transition().duration(half)
      .style("opacity", d => d.key === series ? 1 : fade)
      .style("stroke",  d => d.key === series ? "#e53e3e" : "none")
      .style("stroke-width", d => d.key === series ? 2 : 0);

  // --- 2) 해당 카테고리·시리즈 바 한 개만 선정하여 확대+테두리 ---
  const sel = svg.selectAll(".bar-seg")
    .filter(d => d.data[xField] === category && d.key === series)
    .raise();

  sel.transition().delay(half).duration(half)
    .style("stroke", "#c53030")
    .style("stroke-width", 4)
    .attr("transform", "scale(1.1,1.1)")
    .on("end", function(event, d) {
      // 이 함수 안에서만 this가 SVGRectElement를 가리킵니다.
      //const node = this;

      // 바 중앙 좌표 계산
      const x = +node.getAttribute("x") + node.getAttribute("width")/2;
      const y = +node.getAttribute("y") - 6;
      const v = d.data[yField];

      // --- 3) 값 텍스트 추가 및 페이드인 ---
      svg.append("text")
        .attr("class", "__val__")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("fill", "#c53030")
        .attr("opacity", 0)
        .text(v)
        .transition().duration(half / 2)
          .attr("opacity", 1);
    });
}
