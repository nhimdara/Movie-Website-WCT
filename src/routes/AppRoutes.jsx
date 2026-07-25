import { lazy, useContext, useEffect } from "react";
import Loading from "../components/common/Loading";
import { AuthContext } from "../context/AuthContext";

const Home = lazy(() => import("../pages/Home"));
const Movies = lazy(() => import("../pages/Movies"));
const MovieDetails = lazy(() => import("../pages/MovieDetails"));
const Favourites = lazy(() => import("../pages/Favourites"));
const Watchlist = lazy(() => import("../pages/Watchlist"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const AdminDashboard = lazy(() => import("../components/dashboard/AdminDashboard"));
const NotFound = lazy(() => import("../pages/NotFound"));

const routes = {
  "/": { page: "home", Component: Home, protected: true },
  "/index.html": { page: "home", Component: Home, protected: true },
  "/movies": { page: "movies", Component: Movies, protected: true },
  "/movie": { page: "movies", Component: MovieDetails, protected: true },
  "/favourites": { page: "favourites", Component: Favourites, protected: true },
  "/watchlist": { page: "watchlist", Component: Watchlist, protected: true },
  "/login": { page: "login", Component: Login, guestOnly: true },
  "/register": { page: "register", Component: Register, guestOnly: true },
  "/about": { page: "about", Component: About, protected: true },
  "/contact": { page: "contact", Component: Contact, protected: true },
  "/dashboard": { page: "dashboard", Component: AdminDashboard, protected: true, roles: ["Administrator"] },
};

export function currentRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return routes[path] || { page: "not-found", Component: NotFound };
}

export default function AppRoutes() {
  const { Component, protected: requiresAuth, guestOnly, roles } = currentRoute();
  if (requiresAuth) return <ProtectedRoute roles={roles}><Component /></ProtectedRoute>;
  if (guestOnly) return <GuestRoute><Component /></GuestRoute>;
  return <Component />;
}

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, session } = useContext(AuthContext);
  const isAuthorized = !roles?.length || roles.includes(session?.role);
  useEffect(() => {
    if (!isAuthenticated) {
      const destination = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
      window.location.replace(`/login?next=${destination}`);
    } else if (!isAuthorized) {
      window.location.replace("/");
    }
  }, [isAuthenticated, isAuthorized]);

  if (!isAuthenticated || !isAuthorized) {
    return <main className="auth-redirect" aria-live="polite"><Loading /><p>{isAuthenticated ? "Returning to Home…" : "Checking your session…"}</p></main>;
  }
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    if (isAuthenticated) window.location.replace("/");
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return <main className="auth-redirect" aria-live="polite"><Loading /><p>Opening CineVault…</p></main>;
  }
  return children;
}
