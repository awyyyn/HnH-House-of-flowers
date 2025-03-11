import { Helmet } from "@/components";
import WorkInProgress from "./wip";

export default function Home() {
	return (
		<>
			<Helmet title="Home" />
			<WorkInProgress />
		</>
	);
}
