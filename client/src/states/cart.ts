import { Cart } from "@/types/cart";
import { atom } from "jotai";

const initialCart: Cart = {
	createdAt: new Date().toISOString(),
	id: "",
	items: [],
	updatedAt: new Date().toISOString(),
	userId: "",
};

export const cartAtom = atom<Cart>(initialCart);
