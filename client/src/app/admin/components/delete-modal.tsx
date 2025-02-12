import { User, UserRole } from "@/types";

import {
	Badge,
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Input,
	Label,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components";
import { useState } from "react";
import { Loader } from "lucide-react";
import { useMutation } from "@apollo/client";
import { BLOCK_USER_MUTATION, UNBLOCK_USER_MUTATION } from "@/queries";
import { useToast } from "@/hooks/use-toast";

interface UserInfoModalProps {
	user: User;
	isOpen: boolean;
	onClose: () => void;
	isAdmin?: boolean;
	unblock?: boolean;
}

export default function DeleteUserModal({
	isOpen,
	onClose,
	user,
	unblock = false,
	isAdmin = false,
}: UserInfoModalProps) {
	const [input, setInput] = useState("");
	const { toast } = useToast();
	const [mutate, { loading }] = useMutation(
		unblock ? UNBLOCK_USER_MUTATION : BLOCK_USER_MUTATION
	);

	const handleBlock = async () => {
		try {
			//
			const variables: { id: string; role: UserRole; reason?: string } = {
				id: user.id,
				role: user.role,
			};
			if (!unblock) {
				variables.reason = input;
			}
			await mutate({ variables });
		} catch (err) {
			toast({
				title: "Something went wrong!",
				description: (err as Error).message,
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="text-left">
					<DialogTitle>{isAdmin ? "Ban admin" : "Block user"}</DialogTitle>
					<DialogDescription>
						{unblock
							? `Are you sure you want to ${
									isAdmin ? "unban this admin" : "unblock this user"
							  }`
							: `Are you sure you want to ${
									isAdmin ? "ban this admin" : "block this user"
							  }`}
						?
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-2 -mt-4">
					<Label className="text-sm font-light">
						{unblock ? (
							<>
								{" "}
								Type{" "}
								<Badge variant="secondary" className="px-1">
									confirm
								</Badge>{" "}
								to proceed.
							</>
						) : (
							<>
								Reason for blocking{" "}
								<TooltipProvider>
									<Tooltip delayDuration={0}>
										<TooltipTrigger asChild>
											<b>
												<i>{user.email}</i>
											</b>
										</TooltipTrigger>
										<TooltipContent>
											<p>
												{user.firstName && user.lastName
													? `${user.firstName} ${user.lastName}`
													: user.email}
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</>
						)}
					</Label>
					<Input
						className="dark:bg-primary/10"
						value={input}
						placeholder={unblock ? "confirm" : "Type reason here"}
						onChange={(e) => setInput(e.target.value)}
					/>
				</div>
				<DialogFooter className="sm:justify-end">
					<DialogClose asChild>
						<Button type="button" onClick={onClose} variant="secondary">
							Close
						</Button>
					</DialogClose>
					<Button
						className=""
						onClick={handleBlock}
						disabled={loading || !input || (unblock && input !== "confirm")}>
						{loading ? (
							<Loader className="animate-spin" />
						) : unblock ? (
							isAdmin ? (
								"Ban"
							) : (
								"Block"
							)
						) : isAdmin ? (
							"Unban"
						) : (
							"Unblock"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
