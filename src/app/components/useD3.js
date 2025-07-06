// src/app/components/useD3.js
'use client';
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

/**
 * SVG ref를 반환하고, D3 렌더 함수를 실행·정리해 주는 훅이다.
 * @param {Function} renderChartFn (svgSelection) => void
 * @param {Array}    deps          useEffect 의존성 배열
 */
export function useD3(renderChartFn, deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    renderChartFn(svg);

    return () => {
      svg.selectAll('*').remove();   // cleanup
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
