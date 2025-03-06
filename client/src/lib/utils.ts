import { clsx, type ClassValue } from "clsx";
import { formatDate } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		minimumFractionDigits: 2,
	}).format(amount);
}

export function formatOrderDate(dateString: number): string {
	const date = new Date(dateString);
	return `${formatDate(date, "MMM d, yyyy")} at ${formatDate(date, "h:mm a")}`;
}
