import { useMemo, useState } from "react";
import { FileUpload } from "./file-upload";
import { useAuth } from "@/contexts";
import { Button } from "../ui/button";
import { provinces as allProvinces, barangays, municipalities } from "psgc";
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
import { Mail } from "lucide-react";
import { DatePicker } from "./date-picker";
import { Combobox } from "./combobox";

const accountInformationSchema = z.object({
	firstName: z.string().nonempty(),
	lastName: z.string().nonempty(),
	middleName: z.string(),
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
	const [isEditing, setIsEditing] = useState(setUp);
	const { user } = useAuth();
	const form = useForm<z.infer<typeof accountInformationSchema>>({
		resolver: zodResolver(accountInformationSchema),
		defaultValues: {
			firstName: user?.firstName ?? "",
			lastName: user?.lastName ?? "",
			email: user?.email ?? "",
			phoneNumber: user?.phoneNumber ?? "",
			birthDate: user?.birthDate?.toISOString() ?? "",
			photo: user?.photo ?? "",
		},
	});
	const [cities, setCities] = useState<Choices[]>([]);
	const [streets, setStreets] = useState<Choices[]>([]);

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

	console.log(
		// barangays.all().filter((f) => f.citymun.toLowerCase() === "camalig"),
		municipalities.find("Legazpi"),
		"qqq"
	);

	const handleSubmit = async () => {
		try {
			//
		} catch (err) {
			//
		}
	};

	return (
		<div className="mx-auto  sm:max-w-[80%]">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					{!setUp && (
						<div className="flex justify-end mb-5">
							<Button
								type="button"
								variant={isEditing ? "ghost" : "default"}
								className={`${isEditing && "hover:bg-primary/10"} `}
								onClick={() => setIsEditing((p) => !p)}>
								{isEditing ? "Cancel" : "Edit"}{" "}
							</Button>
							{isEditing && (
								<Button type="submit" className="ml-2">
									Save
								</Button>
							)}
						</div>
					)}
					<div className="grid grid-cols-1 gap-5 w-full gap sm:grid-cols-2">
						<div
							className={`rounded-full border-dashed ${
								!isEditing && "border-transparent"
							} group border-2  relative overflow-hidden h-[200px] w-[200px]  mx-auto   `}>
							{isEditing && (
								<div className="z-50 h-full w-full absolute ">
									<FileUpload onFileUpload={(files) => console.log(files)} />
								</div>
							)}
							{user?.photo && (
								<img
									src={user?.photo}
									alt="profile"
									className={`h-full w-full object-cover absolute z-50 transition-all ${
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
												readOnly={form.formState.isSubmitting || !isEditing}
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
												readOnly={form.formState.isSubmitting || !isEditing}
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
												readOnly={form.formState.isSubmitting || !isEditing}
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
							name="phoneNumber"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										Birth Date
									</FormLabel>
									<FormControl>
										<div className="w-full">
											<DatePicker defaultValue={new Date()} />
										</div>
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
										Province
									</FormLabel>
									<FormControl>
										<div className="w-full">
											<Combobox
												name="province"
												handleSelect={(value) => {
													form.setValue("province", value);
													form.setValue("city", "");
													form.setValue("street", "");
													const cities = provinces.find(
														(p) => p.value === value
													);
													setCities(
														cities?.cities.map((c) => ({
															value: c,
															id: c,
															label: c,
														})) ?? []
													);
												}}
												choices={provinces}
											/>
										</div>
									</FormControl>
									<FormMessage className="dark:text-primary" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="street"
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-black dark:text-white ">
										City / Municipality
									</FormLabel>
									<FormControl>
										<div className="w-full">
											<Combobox
												readonly={
													!form.getValues("province") ||
													form.formState.isSubmitting
												}
												handleSelect={(value) => {
													form.setValue("city", value);
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
										</div>
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
										Barangay / Street
									</FormLabel>
									<FormControl>
										<div className="w-full">
											<Combobox
												readonly={
													form.formState.isSubmitting || !form.getValues("city")
												}
												handleSelect={(value) => {
													form.setValue("street", value);
												}}
												choices={streets}
											/>
										</div>
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
