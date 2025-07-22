import * as d3 from "d3";

/**
 * Determine Range (막대 구간 강조 + 범위선)
 */
export function runDetermineRange(
  chartContainer,
  { from, to, duration = 600 }
) {
  /* ── 색상 ───────────────────────────── */
  const inColor    = "#4caf50";
  const dimOpacity = 0.15;
  const origColor  = "#69b3a2";
  const lineColor  = inColor;

  if (from > to) [from, to] = [to, from];

  /* ── 선택기 ─────────────────────────── */
  const svg = d3.select(chartContainer).select("svg");
  if (svg.empty()) return chartContainer;

  const marginL = +svg.attr("data-m-left") || 0;
  const marginT = +svg.attr("data-m-top")  || 0;
  const plotW   = +svg.attr("data-plot-w") || 0;
  const plotH   = +svg.attr("data-plot-h") || 0;
 let yMax = +svg.attr("data-y-domain-max");
  if (!yMax || isNaN(yMax)) {
    const vals = bars.nodes().map(el => parseFloat(el.getAttribute("data-value")));
    yMax = d3.max(vals);
  }
  const bars = svg.selectAll("rect");

  /* ── 초기화 ──────────────────────────── */
  bars.interrupt()
      .attr("fill", origColor)
      .attr("opacity", 1)
      .attr("stroke", "none");

  svg.selectAll(".annotation, .filter-label, .range-line").remove();

  /* ── y값 → 픽셀 변환 함수 ─────────────── */
  const yPx = v => marginT + plotH * (1 - v / yMax); 

  /* ── 강조 / 비강조 처리 ──────────────── */
  bars.transition()
      .duration(duration)
      .attr("fill", function () {
        const val = parseFloat(this.getAttribute("data-value"));
        return val >= from && val <= to ? inColor : origColor;
      })
      .attr("opacity", function () {
        const val = parseFloat(this.getAttribute("data-value"));
        return val >= from && val <= to ? 1 : dimOpacity;
      });

  /* ── 범위선 두 줄 ────────────────────── */
  [from, to].forEach(v => {
    svg.append("line")
      .attr("class", "range-line")
      .attr("x1", marginL)
      .attr("x2", marginL + plotW)
      .attr("y1", yPx(v))
      .attr("y2", yPx(v))
      .attr("stroke", lineColor)
      .attr("stroke-dasharray", "4 2")
      .attr("stroke-width", 1.5);
  });

  /* ── 라벨 ────────────────────────────── */
  svg.append("text")
     .attr("class", "filter-label")
     .attr("x", 8)
     .attr("y", 14)
     .attr("font-size", 12)
     .attr("fill", inColor)
     .text(`Range ${from}–${to}`);

  return chartContainer;
}
