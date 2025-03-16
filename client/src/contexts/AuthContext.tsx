import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { AuthContextProps, JWTDecoded, User } from "@/types";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@/hooks/use-toast";
import { useSetAtom } from "jotai";
import { cartAtom, notificationAtom, storeAtom } from "@/states";

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
	const setStore = useSetAtom(storeAtom);
	const [user, setUser] = useState<User>(null!);
	const [loading, setLoading] = useState(true);
	const setCart = useSetAtom(cartAtom);
	const setNotification = useSetAtom(notificationAtom);
	const { toast } = useToast();

	useEffect(() => {
		(async () => {
			setLoading(true);
			const token = localStorage.getItem("accessToken");

			if (!token) {
				setLoading(false);
				setValues({ isAuthenticated: false, role: "USER" });
				return;
			}

			try {
				const decoded = jwtDecode<JWTDecoded>(token);
				if (!(decoded.exp! * 1000 > Date.now())) {
					throw new Error("Session expired");
				}

				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/auth/me`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);

				if (response.status !== 200) {
					throw new Error("Session expired");
				}

				const data = await response.json();

				setUser(data.data.user);
				setNotification(data.data.user.notifications || []);
				if (data.data.user.role === "USER") {
					setCart(data.data.user.cart);
				}
				localStorage.setItem("accessToken", data.data.accessToken);
				setValues({ isAuthenticated: true, role: data.data.user.role });
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
		})();
	}, []);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/api`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (response.status !== 200) {
					throw new Error("Something went wrong!");
				}

				const data = await response.json();

				setStore(data);
			} catch (err) {
				toast({
					title: (err as Error).message,
					description: "Something went wrong!",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const login = (token: string, loggedInUser: User) => {
		localStorage.setItem("accessToken", token);

		const decoded = jwtDecode<JWTDecoded>(token);

		if (!(decoded!.exp! * 1000 > Date.now())) {
			localStorage.removeItem("accessToken");
			setValues({ isAuthenticated: false, role: "USER" });
			return;
		}
		if (loggedInUser && loggedInUser.role === "USER") {
			setCart(loggedInUser.cart);
		}
		setUser(loggedInUser);

		setNotification(loggedInUser.notifications || []);
		setValues({ isAuthenticated: true, role: decoded.role });
	};

	const logout = () => {
		localStorage.removeItem("accessToken");
		setValues({ isAuthenticated: false, role: "USER" });
		setLoading(false);
	};

	return (
		<AuthContext.Provider
			value={{ ...values, loading, login, logout, user, setUser, setValues }}>
			{children}
		</AuthContext.Provider>
	);
};
