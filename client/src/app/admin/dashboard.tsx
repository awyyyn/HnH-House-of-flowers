import { Helmet } from "@/components";
import WorkInProgress from "../wip";

export default function Dashboard() {
	return (
		<div>
			<Helmet title="Dashboard" />
			<WorkInProgress />
		</div>
	);
}
