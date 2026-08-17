import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { validateLogin } from "../../utils/validation";
import useLanguage from "../../hooks/useLanguage";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const message = validateLogin({ email, password });
    if (message) return setError(message);

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) return setError(result.message);

    const next = new URLSearchParams(window.location.search).get("next");
    const safeNext =
      next?.startsWith("/") && !next.startsWith("//") ? next : "/";
    window.location.assign(safeNext);
  };

  const useDemoAccount = () => {
    setEmail("admin@cinevault.com");
    setPassword("admin123");
    setError("");
  };

  return (
    <form className="login-form" onSubmit={submit}>
      <div className="login-field">
        <label htmlFor="login-email">{t("email", "Email address")}</label>
        <div className="login-input-wrap">
          <MailIcon />
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
      </div>
      <div className="login-field">
        <div className="login-label-row">
          <label htmlFor="login-password">{t("password", "Password")}</label>
          <a href="/contact">{t("forgotPassword", "Forgot password?")}</a>
        </div>
        <div className="login-input-wrap">
          <LockIcon />
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            minLength="6"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword((show) => !show)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <label className="remember-row">
        <input type="checkbox" defaultChecked />
        <span>{t("keepSignedIn", "Keep me signed in")}</span>
      </label>
      {error && (
        <p className="login-error" role="alert">
          {error}
        </p>
      )}
      <button className="login-submit" disabled={loading}>
        {loading ? (
          <>
            <i /> {t("signingIn", "Signing in…")}
          </>
        ) : (
          <>
            {t("signIn", "Sign in")} <span>→</span>
          </>
        )}
      </button>
      <div className="login-divider">
        <span>or use the demo workspace</span>
      </div>
      <button className="demo-login" type="button" onClick={useDemoAccount}>
        <span>CV</span>
        <b>Fill demo credentials</b>
        <small>Administrator access</small>
      </button>
    </form>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
