import UserMessageList from "./components/user-message-list";

export default function MessagesMobile() {
	return (
		<div className="max-h-[calc(100dvh-6rem)] overflow-hidden h-full">
			<div className="lg:hidden h-full overflow-y-auto">
				<UserMessageList />
			</div>
			<div className="hidden lg:block text-center p-4 text-gray-500">
				Select a conversation to start messaging
			</div>
		</div>
	);
}
