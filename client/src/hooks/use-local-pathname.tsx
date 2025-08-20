import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useLocalPathname() {
  const { pathname } = useLocation();
  const [path, setPath] = useState(() => localStorage.getItem("path") || "/");

  useEffect(() => {
    if (pathname) {
      localStorage.setItem("path", pathname);
      setPath(pathname);
    }
  }, [pathname]);

  return path;
}
