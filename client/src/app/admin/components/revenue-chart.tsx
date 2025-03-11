import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
	desktop: {
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
				<ChartContainer config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}>
						<CartesianGrid vertical={false} />
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
					</AreaChart>
				</ChartContainer>
			</CardContent>
			{/* <CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
						</div>
						<div className="flex items-center gap-2 leading-none text-muted-foreground">
							January - June 2024
						</div>
					</div>
				</div>
			</CardFooter> */}
		</Card>
	);
}
