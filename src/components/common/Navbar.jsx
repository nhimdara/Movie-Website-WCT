import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useTheme from "../../hooks/useTheme";
import { MenuIcon, MoonIcon, SearchIcon, SunIcon } from "./Icons";
import SearchBar from "./SearchBar";
import useMovies from "../../hooks/useMovies";
import useLanguage from "../../hooks/useLanguage";

const links = [
  ["home", "home", "Home", "/"],
  ["movies", "movies", "Movies", "/movies"],
  ["favourites", "favourites", "Favourites", "/favourites"],
  ["watchlist", "watchlist", "Watchlist", "/watchlist"],
  ["about", "about", "About", "/about"],
];

export default function Navbar({ activePage }) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { session, logout, updateAvatar } = useContext(AuthContext);
  const { favourites, watchlist, siteSettings } = useMovies();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const uploadAvatar = (event) => {
    const [file] = event.target.files;
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      window.alert("Choose a PNG, JPG or WebP profile picture.");
      event.target.value = "";
      return;
    }
    if (file.size > 1_000_000) {
      window.alert("Please choose a profile picture smaller than 1 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateAvatar(String(reader.result));
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const closeAccount = (event) => {
      if (
        event.key === "Escape" ||
        (event.type === "pointerdown" &&
          !accountRef.current?.contains(event.target))
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeAccount);
    document.addEventListener("keydown", closeAccount);
    return () => {
      document.removeEventListener("pointerdown", closeAccount);
      document.removeEventListener("keydown", closeAccount);
    };
  }, [accountOpen]);

  return (
    <>
      {siteSettings.announcement && (
        <div className="site-announcement">{siteSettings.announcement}</div>
      )}
      <header
        className={`site-header page-${activePage}${scrolled ? " scrolled" : ""}${siteSettings.announcement ? " has-announcement" : ""}`}
      >
        <div className="nav container">
          <a
            className="brand"
            href="/"
            aria-label={`${siteSettings.brandName} home`}
          >
            <span
              className={`brand-mark${siteSettings.logo ? " has-logo" : ""}`}
            >
              {siteSettings.logo ? <img src={siteSettings.logo} alt="" /> : "▶"}
            </span>
            <span>{siteSettings.brandName}</span>
          </a>
          <nav
            className={`nav-links${menuOpen ? " open" : ""}`}
            aria-label="Primary navigation"
          >
            {links.map(([key, translationKey, label, href]) => (
              <a
                className={activePage === key ? "active" : ""}
                href={href}
                key={key}
                onClick={() => setMenuOpen(false)}
              >
                {t(translationKey, label)}
              </a>
            ))}
            {(!session || session.role === "Administrator") && (
              <a
                className="mobile-account-link"
                href={session ? "/dashboard" : "/login"}
              >
                {session ? t("dashboard", "Dashboard") : t("signIn", "Sign in")}
              </a>
            )}
          </nav>
          <div className="nav-actions">
            <button
              className={`icon-btn${searchOpen ? " active" : ""}`}
              onClick={() => setSearchOpen((open) => !open)}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
            >
              <SearchIcon />
            </button>
            <button
              className="language-btn"
              onClick={toggleLanguage}
              aria-label={
                language === "km" ? "Switch to English" : "ប្ដូរទៅភាសាខ្មែរ"
              }
            >
              {language === "km" ? "EN" : "ខ្មែរ"}
            </button>
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
            {session ? (
              <div className="nav-account" ref={accountRef}>
                <button
                  className="nav-account-trigger"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  <span className={session.avatar ? "has-avatar" : ""}>
                    {session.avatar ? (
                      <img src={session.avatar} alt="" />
                    ) : (
                      session.name
                        ?.split(/\s+/)
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2) || "MN"
                    )}
                  </span>
                  <b>{session.name?.split(" ")[0] || "Account"}</b>
                  <i aria-hidden="true">⌄</i>
                </button>
                {accountOpen && (
                  <div className="nav-account-menu" role="menu">
                    <header>
                      <b>{session.name}</b>
                      <small>{session.email}</small>
                    </header>
                    <div className="nav-photo-actions">
                      <label>
                        {t("uploadPicture", "Upload picture")}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={uploadAvatar}
                        />
                      </label>
                      {session.avatar && (
                        <button onClick={() => updateAvatar("")}>
                          {t("remove", "Remove")}
                        </button>
                      )}
                    </div>
                    {session.role === "Administrator" && (
                      <a role="menuitem" href="/dashboard">
                        {t("dashboard", "Dashboard")} <span>→</span>
                      </a>
                    )}
                    <a role="menuitem" href="/favourites">
                      {t("favourites", "Favourites")} <b>{favourites.length}</b>
                    </a>
                    <a role="menuitem" href="/watchlist">
                      {t("watchlist", "Watchlist")} <b>{watchlist.length}</b>
                    </a>
                    <button
                      role="menuitem"
                      onClick={() => {
                        logout();
                        window.location.assign("/login");
                      }}
                    >
                      {t("signOut", "Sign out")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a className="nav-login" href="/login">
                {t("signIn", "Sign in")} <span>↗</span>
              </a>
            )}
            <button
              className="icon-btn menu-btn"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>
      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
