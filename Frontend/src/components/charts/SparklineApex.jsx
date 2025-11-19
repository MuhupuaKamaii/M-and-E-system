import React from "react";
import ReactApexChart from "react-apexcharts";

export default function SparklineApex({ data = [], color = "#2CB1A3", height = 60, glow = true }) {
  const series = [{ data }];
  const options = {
    chart: {
      type: "area",
      height,
      sparkline: { enabled: true },
      animations: { enabled: true, easing: "easeinout", speed: 500 },
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    stroke: { curve: "smooth", width: 2 },
    tooltip: { theme: "dark", x: { show: false } },
    colors: [color],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        shadeIntensity: 0.4,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 60, 100]
      }
    },
    grid: { show: false },
    dataLabels: { enabled: false }
  };

  const style = glow ? { filter: `drop-shadow(0 0 8px ${color}80)` } : undefined;

  return <ReactApexChart options={options} series={series} type="area" height={height} style={style} />;
}
