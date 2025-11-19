import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandlestickChart({ candles = [], height = 220, background = "#11131a", upColor = "#2F9B62", downColor = "#C0342A" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      height,
      layout: { background: { color: background }, textColor: "rgba(255,255,255,0.85)" },
      grid: { vertLines: { color: "rgba(255,255,255,0.06)" }, horzLines: { color: "rgba(255,255,255,0.06)" } },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.12)" },
      timeScale: { borderColor: "rgba(255,255,255,0.12)", rightOffset: 6, barSpacing: 6 },
      crosshair: { vertLine: { color: "#ffffff55" }, horzLine: { color: "#ffffff55" } },
      autoSize: true,
    });

    const series = chart.addCandlestickSeries({
      upColor,
      borderUpColor: upColor,
      wickUpColor: upColor,
      downColor,
      borderDownColor: downColor,
      wickDownColor: downColor,
    });

    series.setData(candles);
    chart.timeScale().fitContent();

    const onResize = () => chart.applyOptions({ width: ref.current.clientWidth });
    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      chart.remove();
    };
  }, [candles, height, background, upColor, downColor]);

  return <div ref={ref} style={{ width: "100%", height }} />;
}
