// "use client"; 은 필요 없어요—이 파일은 순수 JS입니다.
import * as d3 from "d3";

/**
 * Retrieve Value 애니메이션만 담당하는 함수
 *
 * @param {HTMLElement} chartRoot   차트가 이미 그려진 최상위 DOM 요소
 * @param {Object}      cfg
 *   - age    : 강조할 age group 문자열 (예: "70-74")
 *   - gender : 강조할 gender    문자열 (예: "Women")
 *   - duration? : 애니메이션 총 길이 (default=700ms)
 * @returns {Promise<void>} 애니 끝난 뒤 resolve 됩니다.
 */
export function runRetrieveValue(
  chartRoot,
  { age, gender, duration = 700 }
) {
  return new Promise((resolve) => {
    const root = d3.select(chartRoot);
    const half = duration / 2;

    // 0) 리셋
    root.selectAll(".facet")
      .interrupt()
      .style("opacity", 1)
      .style("stroke", "none");

    root.selectAll(".bar")
      .interrupt()
      .style("stroke", "none")
      .style("stroke-width", 0);

    root.selectAll("text.__value__").remove();

    // 1) facet 페이드 + 테두리
    root.selectAll(".facet")
      .transition().duration(half)
        .style("opacity", d => d === age ? 1 : 0.25)
        .style("stroke",   d => d === age ? "#9CA3AF" : "none")
        .style("stroke-width", d => d === age ? 1.5 : 0);

    // 2) bar 강조
    const bar = root.selectAll(".bar")
      .filter(d => d["Age group"] === age && d.gender === gender);

    bar.raise()
      .transition()
        .delay(half).duration(duration)
        .style("stroke", "#DC2626")
        .style("stroke-width", 4)
      .on("end", () => {
        // 3) 값 라벨
        const n   = bar.node();
        const x   = +n.getAttribute("x") + (+n.getAttribute("width") / 2);
        const y   = +n.getAttribute("y") - 8;
        const val = bar.datum().Percentage;

        root.append("text")
          .attr("class", "__value__")
          .attr("x",              x)
          .attr("y",              y)
          .attr("text-anchor",    "middle")
          .attr("fill",           "#DC2626")
          .attr("opacity",        0)
          .text(`${val.toFixed(2)} %`)
          .transition().duration(duration / 3)
            .attr("opacity", 1)
            .on("end", resolve);  // 여기서 Promise 완료
      });
  });
}
