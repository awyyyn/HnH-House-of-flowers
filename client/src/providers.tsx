import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components";
import { AuthContextProvider } from "./contexts/AuthContext";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<AuthContextProvider>
			<BrowserRouter>
				{children}
				<Toaster />
			</BrowserRouter>
		</AuthContextProvider>
	);
}
