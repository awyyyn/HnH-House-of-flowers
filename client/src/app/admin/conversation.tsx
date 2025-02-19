import { GET_MESSAGES_QUERY, SEND_MESSAGE_MUTATION } from "@/queries";
import { Message } from "../../types/message";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { useLocation, useParams } from "react-router-dom";
import { MESSAGE_SENT_SUBSCRIPTION } from "@/queries/subscriptions";
import { useState, useRef, useEffect } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Input,
} from "@/components";
import { User } from "@/types";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts";

export default function Conversation() {
	const { role } = useAuth();
	const [message, setMessage] = useState("");
	const { userId } = useParams();
	const { state } = useLocation();
	const { toast } = useToast();
	const user = state?.user as User;
	const [messages, setMessages] = useState<Message[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Scroll to bottom when messages change
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const [sendMessage, { loading: messagesLoading }] = useMutation(
		SEND_MESSAGE_MUTATION
	);

	useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
		variables: {
			userId: userId,
			role,
		},
		onData(options) {
			console.log(options, "options");
			setMessages((msgs) => [...msgs, options.data.data.messageSent]);
		},
	});

	const { loading } = useQuery(GET_MESSAGES_QUERY, {
		variables: {
			userId: userId,
		},
		onCompleted(data: { readMessages: Message[] }) {
			setMessages(data?.readMessages ?? []);
		},
		fetchPolicy: "no-cache",
	});

	if (loading) return <div>Loading...</div>;

	const handleSendMessage = async () => {
		if (!message.trim()) return;

		try {
			await sendMessage({
				variables: {
					receiverId: userId,
					content: message.trim(),
				},
			});
			setMessage(""); // Clear input after sending
		} catch (error) {
			toast({
				title: "Error",
				description: (error as Error).message,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex flex-col h-[calc(100dvh-6rem)]">
			{/* Header */}
			<div className="flex items-center px-4 py-3 border-b bg-white dark:bg-zinc-950">
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src={user?.photo} />
						<AvatarFallback className="capitalize">
							{user?.firstName && user?.lastName
								? `${user.firstName[0]}${user.lastName[0]}`
								: "U"}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-medium">
							{user?.firstName} {user?.lastName}
						</p>
						<p className="text-sm text-gray-500">{user?.email}</p>
					</div>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary/5">
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`flex ${
							msg.senderId === userId ? "justify-start" : "justify-end"
						}`}>
						<div
							className={`max-w-[70%] p-3 rounded-lg ${
								msg.senderId === userId
									? "bg-white dark:bg-zinc-800"
									: "bg-primary text-white"
							}`}>
							{msg.content}
						</div>
					</div>
				))}
				{/* Invisible div for scrolling */}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="p-4 border-t bg-white dark:bg-zinc-950">
				<div className="relative flex items-center">
					<Input
						className="pr-12 border-none ring-1 ring-gray-200 dark:ring-gray-800 focus:ring-2 focus:ring-primary"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type a message"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSendMessage();
							}
						}}
						readOnly={messagesLoading}
					/>
					<Button
						size="icon"
						className="absolute right-0"
						disabled={messagesLoading || !message}
						variant="ghost"
						onClick={handleSendMessage}>
						<Send className="h-5 w-5 transition-colors group-hover:stroke-primary" />
					</Button>
				</div>
			</div>
		</div>
	);
}
