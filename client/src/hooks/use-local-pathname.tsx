import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useLocalPathname() {
  const { pathname } = useLocation();
  const [path, setPath] = useState(() => localStorage.getItem("path") || "/");

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pathname) {
        localStorage.setItem("path", pathname);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);

  // Optional: sync the local state when pathname changes (e.g., for internal use)
  useEffect(() => {
    if (pathname !== path) {
      setPath(localStorage.getItem("path") || "/");
    }
  }, [pathname, path]);

  return path;
}
