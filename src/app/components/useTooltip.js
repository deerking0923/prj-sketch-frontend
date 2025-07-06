'use client';
import { useEffect } from 'react';
import * as d3 from 'd3';

/**
 * 컴포넌트마다 부를 수 있는 간단한 툴팁 훅
 *  - 반환: show(x,y,html), hide()
 */
export function useTooltip() {
  useEffect(() => {
    // 전역 툴팁 div가 없으면 한 번만 만든다
    if (!d3.select('#d3-global-tooltip').node()) {
      d3.select('body')
        .append('div')
        .attr('id', 'd3-global-tooltip')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('padding', '4px 8px')
        .style('background', 'rgba(0,0,0,0.8)')
        .style('color', '#fff')
        .style('border-radius', '4px')
        .style('font', '12px sans-serif')
        .style('opacity', 0);
    }
  }, []);

  const tooltip = () => d3.select('#d3-global-tooltip');

  return {
    show: (event, html) => {
      tooltip()
        .html(html)
        .style('left', event.pageX + 12 + 'px')
        .style('top', event.pageY - 28 + 'px')
        .transition().duration(150).style('opacity', 1);
    },
    hide: () => {
      tooltip().transition().duration(150).style('opacity', 0);
    },
  };
}
