export default function SummaryItem({
	count,
	label,
	percentage,
}: {
	label: string;
	count: number;
	percentage: number;
}) {
	return (
		<div className="flex items-center gap-4">
			<div className={`w-3 h-3 rounded-full  bg-primary`}></div>
			<div className="flex-1 space-y-1">
				<p className="text-sm font-medium leading-none capitalize">{label}</p>
				<p className="text-sm text-muted-foreground">{count} product(s)</p>
			</div>
			<div className="font-medium">{percentage}%</div>
		</div>
	);
}
