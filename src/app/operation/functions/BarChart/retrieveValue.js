// BarChart/retrieveValue.js
// “use client”; 주석 처리 된 JS 파일입니다.
import * as d3 from "d3";

/**
 * 단일 BarChart 용 Retrieve Value 애니메이션
 * @param {HTMLElement} chartRoot 차트가 그려진 최상위 DOM
 * @param {{ key: string, value: string|number, duration?: number }} cfg
 *    - key:   강조할 xField 값 (예: "BBC Radio 4")
 *    - value: 강조할 yField 값 (예: "6.2" or 6.2)
 *    - duration?: 애니메이션 길이 (ms)
 */
export function runRetrieveValue(chartRoot, { key, value, duration = 700 }) {
  return new Promise((resolve) => {
    const root = d3.select(chartRoot);
    const half = duration / 2;

    // 0) 리셋
    root.selectAll(".bar")
      .interrupt()
      .style("opacity", 1)
      .style("stroke", "none")
      .style("stroke-width", 0);
    root.selectAll("text.__value__").remove();

    // 1) 다른 바는 반투명
    root.selectAll(".bar")
      .transition().duration(half)
        .style("opacity", d => {
          // d.xField 에 해당하는 드롭다운 파라미터 이름으로 대체하세요
          return String(d.Service) === String(key) ? 1 : 0.25;
        });

    // 2) 대상 바 강조
    const bar = root.selectAll(".bar")
      .filter(d => 
        String(d.Service) === String(key) &&
        String(d["2012/13 Total Cost"]) === String(value)
      );

    bar.raise()
      .transition().delay(half).duration(half)
        .style("stroke", "#DC2626")
        .style("stroke-width", 4)
      .on("end", () => {
        // 3) 값 라벨
        const n   = bar.node();
        const x   = +n.getAttribute("x") + (+n.getAttribute("width")/2);
        const y   = +n.getAttribute("y") - 8;
        const val = bar.datum()["2012/13 Total Cost"];

        root.append("text")
          .attr("class", "__value__")
          .attr("x",           x)
          .attr("y",           y)
          .attr("text-anchor", "middle")
          .attr("fill",        "#DC2626")
          .attr("opacity",     0)
          .text(`${val}`)
          .transition().duration(duration/3)
            .attr("opacity", 1)
            .on("end", resolve);
      });
  });
}
