import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { AuthContextProps, JWTDecoded } from "@/types";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const [values, setValues] = useState<
		Pick<AuthContextProps, "role" | "isAuthenticated">
	>({
		isAuthenticated: false,
		role: "USER",
	});

	const [loading, setLoading] = useState(true);
	// const [user, setUser] = useState<User>(null!);
	const { toast } = useToast();

	useEffect(() => {
		const token = localStorage.getItem("accessToken");

		if (!token) {
			setLoading(false);
			setValues({ isAuthenticated: false, role: "USER" });
			return;
		}

		try {
			const decoded = jwtDecode<JWTDecoded>(token);
			if (!(decoded.exp! * 1000 > Date.now())) {
				throw new Error("Token expired");
			}
			setValues({ isAuthenticated: true, role: decoded.role });
		} catch (err) {
			localStorage.clear();
			toast({
				title: (err as Error).message,
				description: "Please login again",
				variant: "destructive",
			});
			setValues({ isAuthenticated: false, role: "USER" });
		} finally {
			setLoading(false);
		}
	}, []);

	const login = (token: string) => {
		localStorage.setItem("accessToken", token);

		const decoded = jwtDecode<JWTDecoded>(token);

		if (!(decoded!.exp! * 1000 > Date.now())) {
			localStorage.removeItem("accessToken");
			setValues({ isAuthenticated: false, role: "USER" });
			return;
		}

		setValues({ isAuthenticated: true, role: decoded.role });
	};

	const logout = () => {
		localStorage.removeItem("accessToken");
		setValues({ isAuthenticated: false, role: "USER" });
		setLoading(false);
	};

	return (
		<AuthContext.Provider value={{ ...values, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
