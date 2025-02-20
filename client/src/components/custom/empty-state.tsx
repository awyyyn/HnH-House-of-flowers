import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
	actionLabel?: string;
	onAction?: () => void;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	actionLabel,
	onAction,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center   justify-center text-center p-8   rounded-lg">
			<Icon className="w-12 h-12 text-muted-foreground mb-4" />
			<h2 className="text-2xl font-semibold mb-2">{title}</h2>
			<p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
			{actionLabel && onAction && (
				<Button onClick={onAction}>{actionLabel}</Button>
			)}
		</div>
	);
}
