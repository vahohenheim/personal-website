"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const config = {
  leads: { label: "Demandes", color: "var(--accent)" },
} satisfies ChartConfig;

type LeadsChartProps = {
  data: { label: string; leads: number }[];
  /** Horizontal bars, for a breakdown by category. */
  horizontal?: boolean;
};

/** Bars in the accent colour, on rules in the line colour. */
const LeadsChartComponent = ({ data, horizontal = false }: LeadsChartProps) => {
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
        <Bar dataKey="leads" fill="var(--color-leads)" radius={2} maxBarSize={36} />
      </BarChart>
    </ChartContainer>
  );
};

export default LeadsChartComponent;
