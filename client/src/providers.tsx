import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components";
import { AuthContextProvider, ThemeProvider } from "./contexts";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<AuthContextProvider>
			<ThemeProvider>
				<BrowserRouter>
					{children}
					<Toaster />
				</BrowserRouter>
			</ThemeProvider>
		</AuthContextProvider>
	);
}
