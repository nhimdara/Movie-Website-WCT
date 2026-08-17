import LoginForm from "../components/forms/LoginForm";
import useMovies from "../hooks/useMovies";
import useLanguage from "../hooks/useLanguage";
import "./Login.css";

export default function Login() {
  const { siteSettings } = useMovies();
  const { t } = useLanguage();
  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-visual-overlay" />
        <div className="login-visual-brand">
          <span className={siteSettings.logo ? "has-logo" : ""}>
            {siteSettings.logo ? <img src={siteSettings.logo} alt="" /> : "MN"}
          </span>
          <b>{siteSettings.brandName}</b>
        </div>
        <div className="login-feature">
          <span className="login-feature-tag">
            {t("editorSelection", "Featured this week")}
          </span>
          <h1>
            {t("startCollection", "Every great story starts with a frame.")}
          </h1>
          <p>
            {t(
              "curatedCopy",
              "Manage your catalogue and curate unforgettable cinema.",
            )}
          </p>
          <div className="login-feature-meta">
            <span>01</span>
            <i />
            <b>Beyond the Horizon</b>
            <small>2026 · Science Fiction</small>
          </div>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-mobile-brand">
          <span className={siteSettings.logo ? "has-logo" : ""}>
            {siteSettings.logo ? <img src={siteSettings.logo} alt="" /> : "MN"}
          </span>
          <b>{siteSettings.brandName}</b>
        </div>
        <a className="login-back" href="/">
          ← {t("returnHome", "Back to cinema")}
        </a>
        <div className="login-box">
          <header>
            <span>{t("welcomeBack", "Welcome back")}</span>
            <h2>{t("signInWorkspace", "Sign in to your workspace.")}</h2>
            <p>
              {t(
                "signIn",
                "Enter your details to continue to Movie Net Studio.",
              )}
            </p>
          </header>
          <LoginForm />
          <p className="login-register">
            {t("join", "New to Movie Net?")}{" "}
            <a href="/register">{t("createAccount", "Create an account")}</a>
          </p>
          <p className="login-demo-note">
            Demo: <b>admin@movienet.com</b> / <b>admin123</b>
          </p>
        </div>
        <footer>
          <span>© 2026 Movie Net</span>
          <a href="/contact">{t("contact", "Need help?")}</a>
        </footer>
      </section>
    </main>
  );
}
