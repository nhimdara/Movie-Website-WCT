import { Suspense, useContext } from "react";
import BackToTop from "./components/common/BackToTop";
import Footer from "./components/common/Footer";
import Loading from "./components/common/Loading";
import Navbar from "./components/common/Navbar";
import MovieTrailer from "./components/movie/MovieTrailer";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { MovieProvider } from "./context/MovieContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import useMovies from "./hooks/useMovies";
import AppRoutes, { currentRoute } from "./routes/AppRoutes";

function AppContent() {
  const { toast } = useMovies();
  const { isAuthenticated } = useContext(AuthContext);
  const route = currentRoute();
  const isDashboard = route.page === "dashboard";
  const isLogin = route.page === "login";
  const isAuthRedirect = route.protected && !isAuthenticated;
  const hidePublicChrome = isDashboard || isLogin || isAuthRedirect;
  return (
    <>
      {!hidePublicChrome && <Navbar activePage={route.page} />}
      <Suspense
        fallback={
          <main className="page-shell">
            <div className="container">
              <Loading />
            </div>
          </main>
        }
      >
        <AppRoutes />
      </Suspense>
      {!hidePublicChrome && <Footer />}
      {!hidePublicChrome && <MovieTrailer />}
      {!hidePublicChrome && <BackToTop />}
      {!hidePublicChrome && (
        <div
          className={`toast${toast ? " show" : ""}`}
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MovieProvider>
            <AppContent />
          </MovieProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
