import { Chart, Plugin } from "chart.js";

const EFFICIENCY_COLORS: Record<number, string> = {
  0: "rgba(239, 68, 68, 0.7)",
  1: "rgba(251, 191, 36, 0.7)",
  2: "rgba(34, 197, 94, 0.7)",
};

export interface EfficiencyRange {
  start: number;
  end: number;
  value: number;
}

export function createEfficiencyPlugin(
  ranges: EfficiencyRange[],
): Plugin {
  return {
    id: "efficiencyBands",
    beforeDatasetsDraw(chart: Chart) {
      if (!ranges.length) return;

      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;

      const barWidth =
        xAxis.getPixelForValue(1) - xAxis.getPixelForValue(0);

      ctx.save();

      for (const range of ranges) {
        const x1 = xAxis.getPixelForValue(range.start) - barWidth / 2;
        const x2 = xAxis.getPixelForValue(range.end) + barWidth / 2;
        const color = EFFICIENCY_COLORS[range.value];

        const barHeight = 5;
        const y = yAxis.bottom - barHeight;
        ctx.fillStyle = color;
        ctx.fillRect(x1, y, x2 - x1, barHeight);
      }

      ctx.restore();
    },
  };
}

export function computeEfficiencyRanges(
  samples: { ts_end: string; created_at: string }[],
  periods: { from: string; to: string; efficiency: number }[],
): EfficiencyRange[] {
  const ranges: EfficiencyRange[] = [];

  for (const period of periods) {
    const fromMs = new Date(period.from).getTime();
    const toMs = new Date(period.to).getTime();

    let startIdx = -1;
    let endIdx = -1;

    for (let i = 0; i < samples.length; i++) {
      const t = new Date(
        samples[i].ts_end || samples[i].created_at,
      ).getTime();
      if (startIdx === -1 && t >= fromMs) startIdx = i;
      if (t <= toMs) endIdx = i;
    }

    if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
      ranges.push({ start: startIdx, end: endIdx, value: period.efficiency });
    }
  }

  return ranges;
}
