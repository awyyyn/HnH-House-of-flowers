import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	InputWithIcon,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components";
import { cn, formatCurrency } from "@/lib";
import { Product } from "@/types";
import { Check, ChevronsUpDown, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ProductItem({
	products,
	item: product,
	removeOrderItem,
	updateOrderItem,
	updateOrderQuantity,
}: {
	products: Product[];
	item: Product & { quantity: number };
	updateOrderQuantity: (id: string, increment: boolean) => void;
	removeOrderItem: (id: string) => void;
	updateOrderItem: (product: Product, id: string) => void;
}) {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<div className="grid md:grid-cols-12 gap-2 items-end">
			<div className="md:col-span-5">
				<Label htmlFor={`product}`}>Product</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							className="w-full justify-between">
							{product ? product.name : "Select product..."}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[300px] p-0">
						<Command>
							<CommandInput
								placeholder="Search products..."
								value={searchTerm}
								onValueChange={setSearchTerm}
								readOnly={true}
							/>

							<CommandList>
								<CommandEmpty>No products found.</CommandEmpty>
								<CommandGroup>
									{products.map((productItem) => (
										<CommandItem
											key={productItem.id}
											value={productItem.id}
											onSelect={() => {
												updateOrderItem(productItem, product.id);
											}}>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													product?.id === productItem.id
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{productItem.name} {formatCurrency(productItem.price)}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
			<div className="md:col-span-2">
				<Label htmlFor={`quantity`}>Quantity</Label>
				<InputWithIcon
					className="text-center"
					inputProps={{
						value: product.quantity,
						readOnly: true,
					}}
					endIcon={
						<Button
							type="button"
							variant="no-styles"
							className="cursor-pointer p-0 m-0"
							disabled={product.stock >= product.quantity}
							onClick={() => updateOrderQuantity(product.id, true)}>
							<Plus className="h-4 w-4 " />
						</Button>
					}
					startIcon={
						<Button
							type="button"
							variant="no-styles"
							className="cursor-pointer p-0 m-0"
							disabled={product.quantity === 1}
							onClick={() => updateOrderQuantity(product.id, false)}>
							<Minus className="h-4 w-4 " />
						</Button>
					}
				/>
			</div>
			<div className="md:col-span-3">
				<Label htmlFor={`price`}>Price</Label>
				<div className="flex items-center h-10 px-4 border rounded-md bg-muted">
					{formatCurrency(product.price * product.quantity)}
				</div>
			</div>
			<div className="md:col-span-2 flex justify-end">
				<Button
					type="button"
					className="w-full bg-destructive md:bg-transparent"
					variant="ghost"
					size="icon"
					onClick={() => removeOrderItem(product.id)}>
					<span className="block md:hidden text-white">Remove</span>
					<Trash2 className="h-4 w-4  text-white md:text-destructive" />
				</Button>
			</div>
		</div>
	);
}
