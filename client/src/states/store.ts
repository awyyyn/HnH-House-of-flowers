import { StoreSettings } from "@/types";
import { atom } from "jotai";

export const storeAtom = atom<StoreSettings>({
	socialMedia: {
		facebook: "https://www.facebook.com",
		instagram: "https://www.instagram.com",
	},
	policies: {
		privacyPolicy:
			"At Flower Shop, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase.",
		termsOfService:
			"By accessing our website and placing an order, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.",
		returnPolicy:
			"Due to the perishable nature of our products, we do not accept returns. If you are not satisfied with your purchase, please contact us within 24 hours of delivery and we will work to resolve the issue.",
		shippingPolicy:
			"We deliver within our service area on the same day for orders placed before 2 PM. Delivery times may vary based on location and availability. We cannot guarantee specific delivery times.",
	},
	id: "67d4fe5a71a53b2767b1d4de",
	storeName: "House of Flowers",
	storeEmail: "hnhouseofflower@gmail.com",
	storePhone: "9123123123",
	storeAddress: "Polangui, Albay",
	storeDescription:
		"We provide beautiful flowers and bouquets for all occasions.",
	deliveryFee: 50,
	createdAt: "2025-03-15T04:13:14.141Z",
	updatedAt: "2025-03-15T04:13:14.141Z",
});
