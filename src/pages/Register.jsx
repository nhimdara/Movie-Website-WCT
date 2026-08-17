import RegisterForm from "../components/forms/RegisterForm";
import useLanguage from "../hooks/useLanguage";

export default function Register() {
  const { t } = useLanguage();
  return (
    <main className="page-shell">
      <div className="container auth-shell">
        <header className="page-intro">
          <span className="eyebrow">{t("join", "Join CineVault")}</span>
          <h1>{t("startCollection", "Start your collection.")}</h1>
        </header>
        <section className="content-card">
          <RegisterForm />
          <p className="auth-switch">
            {t("alreadyMember", "Already a member?")}{" "}
            <a href="/login">{t("signIn", "Sign in")}</a>
          </p>
        </section>
      </div>
    </main>
  );
}
