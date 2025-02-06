import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<BrowserRouter>
			{children}
			<Toaster />
		</BrowserRouter>
	);
}
