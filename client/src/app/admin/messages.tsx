import { Outlet } from "react-router-dom";
import UserMessageList from "./components/user-message-list";

export default function Messages() {
	return (
		<div className="grid lg:grid-cols-12 h-[calc(100dvh-6rem)] overflow-hidden">
			<div className="hidden lg:block pr-4 lg:col-span-3 overflow-y-auto border-r">
				<UserMessageList />
			</div>
			<div className="lg:col-span-9 overflow-y-auto">
				<Outlet />
			</div>
		</div>
	);
}
