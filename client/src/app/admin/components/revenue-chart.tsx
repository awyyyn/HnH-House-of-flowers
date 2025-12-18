import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function RevenueChart({
  chartData,
}: {
  chartData: { month: string; revenue: number; year: number }[];
}) {
  const start = chartData[0];
  const end = chartData[chartData.length - 1];
  let yearDescription = "";
  if (start.year === end.year) {
    yearDescription = `${start.month} - ${end.month} ${start.year}`;
  }
  yearDescription = `${start.month} ${start.year} - ${end.month} ${end.year}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>Showing data from {yearDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <div className="relative">
            <div className="absolute bg-[#fee4ec60] px-2 top-0 text-xs font-medium bottom-0 justify-evenly flex flex-col leading-none">
              <span>R</span>
              <span>E</span>
              <span>V</span>
              <span>E</span>
              <span>N</span>
              <span>U</span>
              <span>E</span>
            </div>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="hsl(342 93.9% 55.1% / 30%)"
                  fillOpacity={0.4}
                  stroke="hsl(342 93.9% 55.1%)"
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  label={{
                    value: "Revenue",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
          <h1 className="font-medium bg-[#fee4ec60] text-xs text-center tracksing-[3em]">
            MONTHS
          </h1>
        </div>
      </CardContent>
    </Card>
  );
}
