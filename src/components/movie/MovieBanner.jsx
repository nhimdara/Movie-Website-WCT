import { useEffect, useRef, useState } from "react";
import useMovies from "../../hooks/useMovies";
import { moviePoster } from "../../data/movie";
import { PlayIcon, PlusIcon } from "../common/Icons";
import useLanguage from "../../hooks/useLanguage";

export default function MovieBanner() {
  const { movies, watchlist, toggleWatchlist, playTrailer, playMovie, siteSettings } = useMovies();
  const { t } = useLanguage();
  const featuredMovie = movies.find(item => Number(item.id) === Number(siteSettings.featuredMovieId));
  const slides = [featuredMovie, ...movies.filter(item => item.id !== featuredMovie?.id)].filter(Boolean).slice(0, 4);
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [current, slides.length]);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = window.setTimeout(() => setCurrent(index => (index + 1) % slides.length), 5500);
    return () => window.clearTimeout(timer);
  }, [current, slides.length]);

  if (!slides.length) return <section className="hero"><div className="hero-content"><span className="eyebrow">CineVault Studio</span><h1>Your next story<br/><em>starts here.</em></h1><p>Add and publish movies from the admin dashboard to feature them on the home page.</p></div></section>;

  const movie = slides[current] || slides[0];
  const nextMovie = slides[(current + 1) % slides.length];
  const bannerPosters = Array.from({ length: Math.min(3, slides.length) }, (_, offset) =>
    slides[(current + offset) % slides.length]
  );
  const saved = watchlist.includes(movie.id);
  const words = movie.title.trim().split(/\s+/);
  const accentWord = words.pop();
  const leadWords = words.join(" ");
  const isLongTitle = movie.title.length > 22 || words.length > 3;
  const isUpcoming = !movie.rating;
  const goPrevious = () => setCurrent(index => (index - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent(index => (index + 1) % slides.length);
  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(distance) > 45) distance > 0 ? goPrevious() : goNext();
    touchStartX.current = null;
  };

  return <section
    className="hero hero-slider"
    role="region"
    aria-roledescription="carousel"
    aria-label="Featured movies"
    onTouchStart={event => { touchStartX.current = event.touches[0].clientX; }}
    onTouchEnd={handleTouchEnd}
  >
    <div
      key={`background-${movie.id}`}
      className="hero-slide-background"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(8,10,15,.98) 0%, rgba(8,10,15,.72) 38%, rgba(8,10,15,.06) 72%), linear-gradient(0deg, var(--bg) 0%, transparent 38%), url("${moviePoster(movie)}")` }}
    />
    <div key={`posters-${movie.id}`} className="hero-poster-stack" aria-hidden="true">
      {bannerPosters.map((posterMovie, index) => (
        <img
          key={posterMovie.id}
          className={`hero-poster hero-poster-${index + 1}`}
          src={moviePoster(posterMovie)}
          alt=""
        />
      ))}
    </div>
    <div className="hero-film-texture"/>
    <div className="hero-ambient-glow"/>
    <div key={`content-${movie.id}`} className="hero-content hero-slide-content" aria-live="polite">
      <span className="eyebrow">{siteSettings.heroLabel} · {movie.year}</span>
      <h1 className={isLongTitle ? "hero-title-long" : undefined}>{leadWords && <>{leadWords}<br /></>}<em>{accentWord}</em></h1>
      <p>{movie.description}</p>
      <div className="hero-editor-note"><span>{t("editorSelection", "Editor's selection")}</span><i/><small>{siteSettings.heroNote}</small></div>
      <div className="hero-meta"><span>{isUpcoming ? t("comingSoon", "Coming soon") : `★ ${movie.rating}`}</span><span>{movie.genre}</span><span>{movie.duration}</span></div>
      <div className="button-row">
        <button className="btn btn-primary" onClick={() => isUpcoming || !movie.videoUrl ? playTrailer(movie) : playMovie(movie)}><PlayIcon /> {isUpcoming || !movie.videoUrl ? t("watchTrailer", "Watch trailer") : t("watchMovie", "Watch movie")}</button>
        <button className={`btn btn-ghost${saved ? " is-added" : ""}`} onClick={() => toggleWatchlist(movie.id)}><PlusIcon checked={saved} /> {t("myWatchlist", "My watchlist")}</button>
        <a className="hero-details-link" href={`/movie?id=${movie.id}`}>{t("filmDetails", "Film details")} <span>↗</span></a>
      </div>
    </div>

    {slides.length > 1 && <button className="hero-next-card" onClick={goNext} aria-label={`Next movie: ${nextMovie.title}`}>
      <img src={moviePoster(nextMovie)} alt=""/>
      <span><small>{t("upNext", "Up next")}</small><b>{nextMovie.title}</b><i>{nextMovie.genre} · {nextMovie.year}</i></span>
      <strong>→</strong>
    </button>}
    <a className="hero-scroll-cue" href="#trending"><i/><span>{t("scrollDiscover", "Scroll to discover")}</span></a>
    {slides.length > 1 && <div className="hero-index" aria-label="Featured movie slider">
      <button className="hero-arrow" onClick={goPrevious} aria-label="Previous movie">←</button>
      <span className="hero-current">{String(current + 1).padStart(2, "0")}</span>
      <div className="hero-dots">
        {slides.map((slide, index) => <button
          key={slide.id}
          className={index === current ? "active" : ""}
          onClick={() => setCurrent(index)}
          aria-label={`Show ${slide.title}`}
          aria-current={index === current ? "true" : undefined}
        ><i><span /></i></button>)}
      </div>
      <span>{String(slides.length).padStart(2, "0")}</span>
      <button className="hero-arrow" onClick={goNext} aria-label="Next movie">→</button>
    </div>}
  </section>;
}
