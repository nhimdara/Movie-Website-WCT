import RegisterForm from "../components/forms/RegisterForm";

export default function Register() {
  return <main className="page-shell"><div className="container auth-shell">
    <header className="page-intro"><span className="eyebrow">Join CineVault</span><h1>Start your<br />collection.</h1></header>
    <section className="content-card"><RegisterForm /><p className="auth-switch">Already a member? <a href="/login">Sign in</a></p></section>
  </div></main>;
}
