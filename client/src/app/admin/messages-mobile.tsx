import { MessageSquare } from "lucide-react";
import UserMessageList from "./components/user-message-list";

export default function MessagesMobile() {
	return (
		<>
			<div className="max-h-[calc(100dvh-6rem)] overflow-hidden h-full">
				<div className="lg:hidden h-full overflow-y-auto">
					<UserMessageList />
				</div>
				<div className="hidden lg:block text-center p-4 text-gray-500">
					<div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/10">
						<div className="mx-auto flex max-w-[420px] flex-col items-center gap-4">
							<div className="rounded-full bg-muted p-6">
								<MessageSquare className="h-12 w-12 text-muted-foreground" />
							</div>
							<div className="space-y-2">
								<h2 className="text-xl font-semibold tracking-tight">
									Select a conversation
								</h2>
								<p className="text-sm text-muted-foreground">
									Choose a conversation from the sidebar to start messaging
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
