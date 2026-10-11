"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type BarsChartProps = {
  /** Name of the series, shown in the tooltip. */
  seriesLabel: string;
  data: { label: string; value: number }[];
  /** Horizontal bars, for a breakdown by category. */
  horizontal?: boolean;
};

/** Bars in the accent colour, on rules in the line colour. */
const BarsChartComponent = ({ seriesLabel, data, horizontal = false }: BarsChartProps) => {
  const config = {
    value: { label: seriesLabel, color: "var(--accent)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-[220px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ left: horizontal ? 8 : 0, right: 8, top: 8 }}
      >
        <CartesianGrid vertical={horizontal} horizontal={!horizontal} stroke="var(--line)" />
        {horizontal ? (
          <>
            <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="label" width={150} tickLine={false} axisLine={false} />
          </>
        ) : (
          <>
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
          </>
        )}
        <ChartTooltip cursor={{ fill: "var(--surface)" }} content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={2} maxBarSize={36} />
      </BarChart>
    </ChartContainer>
  );
};

export default BarsChartComponent;
