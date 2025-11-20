import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function TimeSeriesChart({ data = [], height = 220, color = "#7c4dff", background = "#11131a" }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    let chart;
    try {
      chart = createChart(ref.current, {
        height,
        layout: { background: { color: background }, textColor: "rgba(255,255,255,0.8)" },
        grid: {
          vertLines: { color: "rgba(255,255,255,0.06)" },
          horzLines: { color: "rgba(255,255,255,0.06)" }
        },
        rightPriceScale: { borderColor: "rgba(255,255,255,0.12)" },
        timeScale: { borderColor: "rgba(255,255,255,0.12)", rightOffset: 6, barSpacing: 6 },
        crosshair: { vertLine: { color: "#ffffff55", width: 1, style: 0 }, horzLine: { color: "#ffffff55", width: 1, style: 0 } },
        autoSize: true,
      });
    } catch (err) {
      // If createChart fails, log a helpful error and bail out
      // eslint-disable-next-line no-console
      console.error("TimeSeriesChart: failed to create chart", err);
      return;
    }

    let series;
    try {
      series = chart.addAreaSeries({
        topColor: `${color}40`,
        bottomColor: `${color}05`,
        lineColor: color,
        lineWidth: 2,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("TimeSeriesChart: failed to add series", err);
      chart.remove();
      return;
    }

    try {
      series.setData(data || []);
      if (chart.timeScale && typeof chart.timeScale === 'function') {
        chart.timeScale().fitContent();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("TimeSeriesChart: failed to set data or fit time scale", err, { dataSample: (data && data.slice && data.slice(0,3)) || data });
    }

    chartRef.current = chart;
    const onResize = () => {
      if (!ref.current) return;
      try { chart.applyOptions({ width: ref.current.clientWidth }); } catch (err) { /* ignore resize errors */ }
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => { window.removeEventListener("resize", onResize); chart.remove(); };
  }, [data, height, color, background]);

  return <div ref={ref} style={{ width: "100%", height }} />;
}
