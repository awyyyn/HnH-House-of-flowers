import { ReactNode } from "react";
import { Helmet } from "react-helmet";

export default function HelmetComponent({
	title,
	children,
}: {
	title: string;
	children?: ReactNode;
}) {
	return (
		<Helmet>
			<title>HnH | {title}</title>
			{children && children}
		</Helmet>
	);
}
