import { User } from "@/types";

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
	Label,
} from "@/components";
import { statusColorMap } from "@/constants";

interface UserInfoModalProps {
	user: User;
	isOpen: boolean;
	onClose: () => void;
	isAdmin?: boolean;
}

export default function UserInfoModal({
	isOpen,
	onClose,
	user,
	isAdmin,
}: UserInfoModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="md:max-w-screen-md">
				<DialogHeader className="text-left">
					<DialogTitle>{isAdmin ? "Admin" : "User"} Info</DialogTitle>
					<DialogDescription>
						Details about the {isAdmin ? "admin" : "user"} are displayed below.
					</DialogDescription>
				</DialogHeader>
				<div className="  items-center  gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
					<div className="">
						<Label>First Name</Label>
						<p>
							{user.firstName ?? (
								<span style={{ fontStyle: "italic", color: "gray" }}>
									No Data
								</span>
							)}
						</p>
					</div>
					<div className="">
						<Label>Last Name</Label>
						<p>
							{user.firstName ?? (
								<span style={{ fontStyle: "italic", color: "gray" }}>
									No Data
								</span>
							)}
						</p>
					</div>
					<div className="">
						<Label>Middle Name</Label>
						<p>
							{user?.middleName || (
								<span style={{ fontStyle: "italic", color: "gray" }}>
									No Data
								</span>
							)}
						</p>
					</div>
					<div className="">
						<Label>Birth Date</Label>
						<p>
							{user?.birthDate ?? (
								<span style={{ fontStyle: "italic", color: "gray" }}>
									No Data
								</span>
							)}
						</p>
					</div>
					<div className="">
						<Label>Phone Number</Label>
						<p>
							{user.phoneNumber ?? (
								<span style={{ fontStyle: "italic", color: "gray" }}>
									No Data
								</span>
							)}
						</p>
					</div>
					<div className="">
						<Label>Email</Label>
						<p>
							{user.email ?? (
								<span style={{ fontStyle: "italic", color: "gray" }}>
									No Data
								</span>
							)}
						</p>
					</div>
					<div className="">
						<Label>City / Municipality</Label>
						{user.address?.zone ? (
							<p>{user.address?.city}</p>
						) : (
							<i className="block text-gray-400">No data</i>
						)}
					</div>
					<div className="">
						<Label>Street</Label>
						{user.address?.zone ? (
							<p>{user.address?.street}</p>
						) : (
							<i className="block text-gray-400">No data</i>
						)}
					</div>
					<div className="">
						<Label>Zone </Label>
						{user.address?.zone ? (
							<p>{user.address?.zone}</p>
						) : (
							<i className="block text-gray-400">No data</i>
						)}
					</div>

					<div className="">
						<Label>Status</Label>
						<p>
							<Badge variant={statusColorMap[user.status]}>
								{user.status === "DELETED" ? "BLOCKED" : user.status}
							</Badge>
						</p>
					</div>
				</div>
				<DialogFooter className="sm:justify-end">
					<DialogClose asChild>
						<Button
							type="button"
							onClick={onClose}
							variant="secondary"
							className="dark:bg-primary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
