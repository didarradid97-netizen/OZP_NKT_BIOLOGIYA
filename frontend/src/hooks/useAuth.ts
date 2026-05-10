import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_PATH } from "@/const";
import { isAuthenticated, logout as doLogout, getStoredUser } from "@/lib/auth";

export function useAuth(options?: { redirectOnUnauthenticated?: boolean; redirectPath?: string }) {
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } = options ?? {};
  const navigate = useNavigate();

  const user = useMemo(() => getStoredUser(), []);

  const logout = useCallback(() => {
    doLogout();
    navigate(redirectPath);
    window.location.reload();
  }, [navigate, redirectPath]);

  return useMemo(
    () => ({
      user,
      isAuthenticated: isAuthenticated(),
      isLoading: false,
      error: null,
      logout,
      refresh: () => {},
    }),
    [user, logout]
  );
}
