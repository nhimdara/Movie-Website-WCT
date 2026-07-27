import useMovies from "../../hooks/useMovies";
import useLanguage from "../../hooks/useLanguage";

export default function Footer() {
  const { siteSettings } = useMovies();
  const { t } = useLanguage();
  return <footer className="site-footer"><div className="container">
    <div className="footer-grid">
      <div className="footer-brand"><a className="brand" href="/"><span className={`brand-mark${siteSettings.logo ? " has-logo" : ""}`}>{siteSettings.logo ? <img src={siteSettings.logo} alt=""/> : "▶"}</span><span>{siteSettings.brandName}</span></a><p>{t("footerCopy", siteSettings.footerTagline)}</p><span className="footer-note">{t("movieNights", "Made for movie nights.")}</span></div>
      <div><h3>{t("explore", "Explore")}</h3><a href="/movies">{t("allMovies", "All movies")}</a><a href="/favourites">{t("favourites", "Favourites")}</a><a href="/watchlist">{t("watchlist", "Watchlist")}</a></div>
      <div><h3>{t("company", "Company")}</h3><a href="/about">{t("about", "About")}</a><a href="/contact">{t("contact", "Contact")}</a></div>
      <div><h3>{t("account", "Account")}</h3><a href="/login">{t("signIn", "Sign in")}</a><a href="/register">{t("createAccount", "Create account")}</a></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {siteSettings.brandName}. {t("rights", "All rights reserved.")}</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{t("backTop", "Back to top")} ↑</a></div>
  </div></footer>;
}
