import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components";
import { AuthContextProvider, ThemeProvider } from "./contexts";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ApolloProvider client={client}>
			<AuthContextProvider>
				<ThemeProvider>
					<BrowserRouter>
						{children}
						<Toaster />
					</BrowserRouter>
				</ThemeProvider>
			</AuthContextProvider>
		</ApolloProvider>
	);
}
