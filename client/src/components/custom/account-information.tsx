import { useMemo, useState } from "react";
import { FileUpload } from "./file-upload";
import { useAuth } from "@/contexts";
import { Button } from "../ui/button";
import { provinces as allProvinces, barangays } from "psgc";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { InputWithIcon } from "./flexible-input";
import { Loader, Mail } from "lucide-react";
import { DatePicker } from "./date-picker";
import { Combobox } from "./combobox";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "@/queries";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const accountInformationSchema = z.object({
	firstName: z.string().nonempty(),
	lastName: z.string().nonempty(),
	middleName: z.string().optional(),
	email: z.string().email(),
	phoneNumber: z
		.string()
		.regex(/^9\d{9}$/, "Phone Number must start with 9 and be 10 digits long")
		.nonempty("Phone Number is required"),
	birthDate: z.string().nonempty(),
	photo: z.string().optional(),
	zone: z.string().optional(),
	street: z.string(),
	city: z.string(),
	province: z.string(),
});

interface Choices {
	id: string;
	label: string;
	value: string;
}

export default function AccountInformation({
	setUp = false,
}: {
	setUp?: boolean;
}) {
	const [setupAccount] = useMutation(UPDATE_USER_MUTATION);
	const [isEditing, setIsEditing] = useState(setUp);
	const [uploading, setUploading] = useState(false);
	const { user, setUser } = useAuth();
	const form = useForm<z.infer<typeof accountInformationSchema>>({
		resolver: zodResolver(accountInformationSchema),
		defaultValues: {
			firstName: user?.firstName ?? "",
			lastName: user?.lastName ?? "",
			email: user?.email ?? "",
			phoneNumber: user?.phoneNumber ?? "",
			birthDate: user?.birthDate ?? "",
			photo: user?.photo ?? "",
			city: user?.address?.city ?? "",
			province: user?.address?.province ?? "",
			street: user?.address?.street ?? "",
			zone: user?.address?.zone ?? "",
		},
	});
	const navigate = useNavigate();
	const [cities, setCities] = useState<Choices[]>([]);
	const [streets, setStreets] = useState<Choices[]>([]);
	const { toast } = useToast();

	const provinces = useMemo(
		() =>
			allProvinces.all().map((p) => ({
				value: p.name,
				id: p.name,
				label: p.name,
				cities: p.municipalities.map((m) => m.name),
			})),
		[]
	);

	const handleSubmit = async (
		values: z.infer<typeof accountInformationSchema>
	) => {
		try {
			const { data } = await setupAccount({
				variables: {
					data: {
						firstName: values.firstName,
						middleName: values.middleName,
						lastName: values.lastName,
						phoneNumber: values.phoneNumber,
						birthDate: values.birthDate,
						photo: values.photo,
						address: {
							province: values.province,
							city: values.city,
							street: values.street,
							zone: values.zone,
						},
					},
				},
			});
			setUser(data.user);
			if (setUp) {
				navigate(data.user.role === "USER" ? "/" : "/dashboard", {
					replace: true,
				});
			} else {
				setIsEditing(false);
			}
			toast({
				title: "Success",
				description: "Account information updated",
				variant: "success",
			});
		} catch (err) {
			toast({
				title: "Error",
				description: (err as Error).message,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="mx-auto  md:max-w-[80%]">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<div className="flex justify-end mb-5">
						{!setUp && (
							<Button
								type="button"
								variant={isEditing ? "ghost" : "default"}
								className={`${isEditing && "hover:bg-primary/10"} `}
								onClick={() => setIsEditing((p) => !p)}>
								{isEditing ? "Cancel" : "Edit"}{" "}
							</Button>
						)}

						{isEditing && (
							<Button
								disabled={form.formState.isSubmitting || uploading}
								type="submit"
								className="ml-2">
								{form.formState.isSubmitting ? (
									<Loader className="animate-spin" />
								) : (
									"Save"
								)}
							</Button>
						)}
					</div>

					<div className="grid grid-cols-1 gap-5 w-full gap md:grid-cols-2">
						<div
							className={`rounded-full ${
								uploading ? "border-transparent " : "border-dashed shadow-md"
							} ${
								!isEditing && "border-transparent"
							} group border-2 group relative overflow-hidden h-[200px] w-[200px]  mx-auto   `}>
							{uploading && (
								<div className="h-full w-full flex justify-center items-center bg-white object-cover absolute z-[99] transition-all">
									<Loader className="animate-spin" />
								</div>
							)}
							{isEditing && (
								<div className="group-hover:z-[56] z-50 h-full w-full absolute ">
									<FileUpload
										onFileUpload={(files) => {
											const url = `https://api.cloudinary.com/v1_1/${
												import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
											}/upload`;
											const fd = new FormData();
											// fd.append("upload_preset", unsignedUploadPreset);
											fd.append("upload_preset", "avatars");
											fd.append("tags", "user-avatar"); // Optional - add tags for image admin in Cloudinary
											fd.append("tags", "browser-upload"); // Optional - add tags for image admin in Cloudinary
											fd.append("file", files[0]);
											setUploading(true);
											fetch(url, {
												method: "POST",
												body: fd,
											})
												.then((response) => response.json())
												.then((data) => {
													form.setValue("photo", data.url);
												})
												.catch((error) => {
													console.error("Error uploading the file:", error);
													toast({
														title: "Error",
														description: "Error uploading the file",
														variant: "destructive",
													});
												})
												.finally(() => {
													setUploading(false);
												});
										}}
									/>
								</div>
							)}
							{user?.photo && (
								<img
									src={form.getValues("photo") ?? user.photo}
									alt="profile"
									className={`h-full w-full bg-white object-cover absolute z-50 transition-all ${
										isEditing ? "group-hover:opacity-5" : " "
									}`}
								/>
							)}
						</div>
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem className="flex flex-col items-start">
										<FormLabel className="text-black dark:text-white ">
											First Name
										</FormLabel>
										<FormControl>
											<Input
												readOnly={
													form.formState.isSubmitting || !isEditing || uploading
												}
												placeholder={`${
													user?.firstName
														? ""
														: isEditing
														? "Your first name"
														: "No data"
												}`}
												className={`${
													isEditing
														? "dark:border-primary/50"
														: "dark:border-transparent border-transparent  focus:outline-transparent"
												} placeholder:italic`}
												{...field}
											/>
										</FormControl>
										<FormMessage className="dark:text-primary" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="middleName"
								render={({ field }) => (
									<FormItem className="flex flex-col items-start">
										<FormLabel className="text-black dark:text-white ">
											Middle Name
										</FormLabel>
										<FormControl>
											<Input
												readOnly={
													form.formState.isSubmitting || !isEditing || uploading
												}
												placeholder={`${
													user?.firstName
														? ""
														: isEditing
														? "Your middle name"
														: "No data"
												}`}
												className={`${
													isEditing
														? "dark:border-primary/50"
														: "dark:border-transparent border-transparent  focus:outline-transparent"
												} placeholder:italic`}
												{...field}
											/>
										</FormControl>
										<FormMessage className="dark:text-primary" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem className="flex flex-col items-start">
										<FormLabel className="text-black dark:text-white ">
											Last Name
										</FormLabel>
										<FormControl>
											<Input
												readOnly={
													form.formState.isSubmitting || !isEditing || uploading
												}
												placeholder={`${
													user?.firstName
														? ""
														: isEditing
														? "Your last name"
														: "No data"
												}`}
												className={`${
													isEditing
														? "dark:border-primary/50"
														: "dark:border-transparent border-transparent  focus:outline-transparent"
												} placeholder:italic`}
												{...field}
											/>
										</FormControl>
										<FormMessage className="dark:text-primary" />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Email
									</FormLabel>
									<FormControl>
										<InputWithIcon
											startIcon={<Mail className="text-gray-500 h-5 w-5" />}
											inputProps={{
												readOnly: true,
												...field,
											}}
											className={`${
												isEditing
													? "dark:border-primary/50"
													: "dark:border-transparent border-transparent  focus:outline-transparent"
											} placeholder:italic`}
										/>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phoneNumber"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Phone Number
									</FormLabel>
									<FormControl>
										<InputWithIcon
											startIcon={<p className="text-gray-500">+63</p>}
											inputProps={{
												readOnly: !isEditing || form.formState.isSubmitting,
												placeholder: `${
													user?.phoneNumber
														? ""
														: isEditing
														? "Your phone number"
														: "No data"
												}`,
												...field,
											}}
											className={`${
												isEditing
													? "dark:border-primary/50"
													: "dark:border-transparent border-transparent  focus:outline-transparent"
											} placeholder:italic`}
										/>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="birthDate"
							render={() => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Birth Date
									</FormLabel>
									<FormControl>
										<div className="w-full">
											<DatePicker
												handleChangeValue={(v) => {
													form.setValue("birthDate", v.toISOString());
													form.clearErrors("birthDate");
												}}
												readonly={!isEditing || form.formState.isSubmitting}
												defaultValue={
													user?.birthDate ? new Date(user.birthDate) : undefined
												}
											/>
										</div>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="province"
							render={() => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Province
									</FormLabel>
									<FormControl>
										<div className="w-full">
											{isEditing ? (
												<Combobox
													name="province"
													handleSelect={(value) => {
														form.setValue("province", value);
														form.setValue("city", "");
														form.setValue("street", "");
														const cities = provinces.find(
															(p) => p.value === value
														);
														form.clearErrors("province");
														setCities(
															cities?.cities.map((c) => ({
																value: c,
																id: c,
																label: c,
															})) ?? []
														);
													}}
													readonly={!isEditing || form.formState.isSubmitting}
													choices={provinces}
												/>
											) : (
												<Input readOnly value={user?.address?.province} />
											)}
										</div>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="street"
							render={() => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										City / Municipality
									</FormLabel>
									<FormControl>
										<div className="w-full">
											{isEditing ? (
												<Combobox
													name="city or municipality"
													readonly={
														!form.getValues("province") ||
														!isEditing ||
														form.formState.isSubmitting
													}
													handleSelect={(value) => {
														form.setValue("city", value);
														form.setValue("street", "");
														form.clearErrors("city");
														setStreets(
															barangays
																.all()
																.filter(
																	(f) =>
																		f.citymun.toLowerCase() ===
																		value.toLowerCase()
																)
																.map((b) => ({
																	value: b.name,
																	id: b.name,
																	label: b.name,
																})) ?? []
														);
													}}
													choices={cities}
												/>
											) : (
												<Input readOnly value={user?.address?.city} />
											)}
										</div>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="street"
							render={() => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Barangay / Street
									</FormLabel>
									<FormControl>
										<div className="w-full">
											{isEditing ? (
												<Combobox
													name="street"
													readonly={
														form.formState.isSubmitting ||
														!form.getValues("city") ||
														!isEditing
													}
													handleSelect={(value) => {
														form.setValue("street", value);
														form.clearErrors("street");
													}}
													choices={streets}
												/>
											) : (
												<Input readOnly value={user?.address?.street} />
											)}
										</div>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="zone"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Purok / Zone
									</FormLabel>
									<FormControl>
										<Input
											readOnly={
												form.formState.isSubmitting || !isEditing || uploading
											}
											placeholder={`${
												user?.address?.zone ? "" : isEditing ? "" : "No data"
											}`}
											className={`${
												isEditing
													? "dark:border-primary/50"
													: "dark:border-transparent border-transparent  focus:outline-transparent"
											} placeholder:italic`}
											{...field}
										/>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>
					</div>
				</form>
			</Form>
		</div>
	);
}
