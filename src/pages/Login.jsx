import LoginForm from "../components/forms/LoginForm";
import useMovies from "../hooks/useMovies";
import "./Login.css";

export default function Login() {
  const { siteSettings } = useMovies();
  return <main className="login-page">
    <section className="login-visual">
      <div className="login-visual-overlay"/>
      <div className="login-visual-brand"><span className={siteSettings.logo ? "has-logo" : ""}>{siteSettings.logo ? <img src={siteSettings.logo} alt=""/> : "CV"}</span><b>{siteSettings.brandName}</b></div>
      <div className="login-feature">
        <span className="login-feature-tag">Featured this week</span>
        <h1>Every great story<br/>starts with a frame.</h1>
        <p>Manage your catalogue, understand your audience, and curate unforgettable cinema.</p>
        <div className="login-feature-meta"><span>01</span><i/><b>Beyond the Horizon</b><small>2026 · Sci-Fi</small></div>
      </div>
    </section>
    <section className="login-panel">
      <div className="login-mobile-brand"><span className={siteSettings.logo ? "has-logo" : ""}>{siteSettings.logo ? <img src={siteSettings.logo} alt=""/> : "CV"}</span><b>{siteSettings.brandName}</b></div>
      <a className="login-back" href="/">← Back to cinema</a>
      <div className="login-box">
        <header><span>Welcome back</span><h2>Sign in to your<br/>workspace.</h2><p>Enter your details to continue to CineVault Studio.</p></header>
        <LoginForm />
        <p className="login-register">New to CineVault? <a href="/register">Create an account</a></p>
        <p className="login-demo-note">Demo: <b>admin@cinevault.com</b> / <b>admin123</b></p>
      </div>
      <footer><span>© 2026 CineVault</span><a href="/contact">Need help?</a></footer>
    </section>
  </main>;
}
