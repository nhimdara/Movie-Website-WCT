import { createContext, useCallback, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { DEMO_ADMIN, STORE_KEYS } from "../data/movie";

export const AuthContext = createContext(null);

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(STORE_KEYS.user, null);
  const [session, setSession] = useLocalStorage(STORE_KEYS.session, null);
  const [accounts, setAccounts] = useLocalStorage(STORE_KEYS.accounts, []);

  const register = useCallback(
    async (details) => {
      const email = details.email.trim().toLowerCase();
      const exists =
        email === DEMO_ADMIN.email ||
        accounts.some((account) => account.email === email);
      if (exists)
        return {
          ok: false,
          message: "An account with this email already exists.",
        };

      const account = {
        name: details.name.trim(),
        email,
        passwordHash: await hashPassword(details.password),
        role: "Member",
      };
      setAccounts((current) => [...current, account]);
      setUser({ name: account.name, email: account.email, role: account.role });
      return { ok: true };
    },
    [accounts, setAccounts, setUser],
  );

  const login = useCallback(
    async (emailValue, password) => {
      const email = emailValue.trim().toLowerCase();
      const isDemoAdmin =
        email === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
      const account = accounts.find((item) => item.email === email);
      const validAccount =
        account && account.passwordHash === (await hashPassword(password));

      if (!isDemoAdmin && !validAccount) {
        return { ok: false, message: "Email or password is incorrect." };
      }

      const profile = isDemoAdmin
        ? {
            name: DEMO_ADMIN.name,
            email,
            role: DEMO_ADMIN.role,
            avatar: user?.email === email ? user.avatar || "" : "",
          }
        : {
            name: account.name,
            email: account.email,
            role: account.role,
            avatar: account.avatar || "",
          };
      setUser(profile);
      setSession({
        ...profile,
        signedIn: true,
        signedInAt: new Date().toISOString(),
      });
      return { ok: true, user: profile };
    },
    [accounts, setSession, setUser, user],
  );

  const logout = useCallback(() => setSession(null), [setSession]);

  const updateAvatar = useCallback(
    (avatar) => {
      setUser((current) => (current ? { ...current, avatar } : current));
      setSession((current) => (current ? { ...current, avatar } : current));
      setAccounts((current) =>
        current.map((account) =>
          account.email === session?.email ? { ...account, avatar } : account,
        ),
      );
    },
    [session?.email, setAccounts, setSession, setUser],
  );

  const value = useMemo(
    () => ({
      user,
      session,
      isAuthenticated: Boolean(session?.signedIn),
      register,
      login,
      logout,
      updateAvatar,
    }),
    [user, session, register, login, logout, updateAvatar],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
