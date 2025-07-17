// src/app/operation/functions/MultipleChart/filterValue.js
import * as d3 from "d3";

/**
 * Filter 애니메이션
 * @param {HTMLElement} chartRoot - 차트가 이미 그려진 최상위 DOM 요소
 * @param {Object} cfg
 *   - gender    : 필터할 성별 문자열 ("Men" 또는 "Women")
 *   - threshold : yField 기준 임계값 (e.g. 70)
 *   - duration? : 애니메이션 총 길이(ms), default=800
 */
export function filterValue(
  chartRoot,
  { gender, threshold, duration = 800 }
) {
  const root = d3.select(chartRoot);
  const bars = root.selectAll(".bar");
  const dur1 = duration / 3;

  // 0) 리셋
  root.selectAll(".facet")
    .interrupt()
    .style("opacity", 1)
    .style("stroke", "none");

  bars.interrupt()
    .style("opacity", 1)
    .style("stroke", "none")
    .style("stroke-width", 0);

  root.selectAll("text.__filter__").remove();

  // 1) 전체 페이드 아웃
  bars
    .transition().duration(dur1)
    .style("opacity", 0.2);

  // 2) filter 조건에 맞는 바만 highlight
  //    filter 콜백의 (d,i,nodes) 3-args 형태를 써야
  //    d가 datum(데이터)로 들어옵니다.
  const target = bars.filter(function(d) {
    return d.gender === gender && +d.Percentage < threshold;
  });

  target
    .raise()
    .transition()
      .delay(dur1)
      .duration(duration)
      .style("opacity", 1)
      .style("stroke", "#DC2626")
      .style("stroke-width", 3)
    .on("end", function() {
      // 3) 각 바 위에 값 레이블
      const d = d3.select(this).datum();
      const rect = d3.select(this);
      const x = +rect.attr("x") + +rect.attr("width") / 2;
      const y = +rect.attr("y") - 8;

      d3.select(this.parentNode) // 같은 facet <g> 위에 텍스트 추가
        .append("text")
        .attr("class", "__filter__")
        .attr("x",           x)
        .attr("y",           y)
        .attr("text-anchor", "middle")
        .attr("fill",        "#DC2626")
        .attr("opacity",     0)
        .text(`${d.Percentage.toFixed(2)} %`)
        .transition()
          .delay(0)
          .duration(dur1)
          .attr("opacity", 1);
    });
}
