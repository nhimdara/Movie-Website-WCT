import useMovies from "../../hooks/useMovies";

export default function Footer() {
  const { siteSettings } = useMovies();
  return <footer className="site-footer"><div className="container">
    <div className="footer-grid">
      <div className="footer-brand"><a className="brand" href="/"><span className={`brand-mark${siteSettings.logo ? " has-logo" : ""}`}>{siteSettings.logo ? <img src={siteSettings.logo} alt=""/> : "▶"}</span><span>{siteSettings.brandName}</span></a><p>{siteSettings.footerTagline}</p><span className="footer-note">Made for movie nights.</span></div>
      <div><h3>Explore</h3><a href="/movies">All movies</a><a href="/favourites">Favourites</a><a href="/watchlist">Watchlist</a></div>
      <div><h3>Company</h3><a href="/about">About</a><a href="/contact">Contact</a></div>
      <div><h3>Account</h3><a href="/login">Sign in</a><a href="/register">Create account</a></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {siteSettings.brandName}. All rights reserved.</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top ↑</a></div>
  </div></footer>;
}
