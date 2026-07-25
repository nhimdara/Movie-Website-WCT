import { useRef, useState } from "react";
import { HeartIcon, PlayIcon, PlusIcon } from "../components/common/Icons";
import MovieBanner from "../components/movie/MovieBanner";
import { moviePoster } from "../data/movies";
import useMovies from "../hooks/useMovies";

function StreamingCard({
  movie,
  favourite,
  saved,
  progress,
  onFavourite,
  onPlay,
  onWatchlist,
}) {
  return <article className="stream-card">
    <div className="stream-card-frame">
      <a className="stream-card-art" href={`/movie?id=${movie.id}`} aria-label={`View ${movie.title}`}>
        <img src={moviePoster(movie)} alt="" />
      </a>
      <div className="stream-card-shade" />
      <div className="stream-card-copy">
        <a href={`/movie?id=${movie.id}`}><h3>{movie.title}</h3></a>
        <div className="stream-card-meta">
          <b>{Math.round(movie.rating * 10)}% Match</b>
          <span>{movie.year}</span>
          <span>{movie.genre}</span>
        </div>
      </div>
      <div className="stream-card-actions">
        <button className="stream-play" onClick={() => onPlay(movie)} aria-label={`Play ${movie.title}`}><PlayIcon /></button>
        <button className={saved ? "is-added" : ""} onClick={() => onWatchlist(movie.id)} aria-label={`Add ${movie.title} to My List`}><PlusIcon checked={saved} /></button>
        <button className={favourite ? "is-added" : ""} onClick={() => onFavourite(movie.id)} aria-label={`Favourite ${movie.title}`}><HeartIcon filled={favourite} /></button>
        <a className="stream-more" href={`/movie?id=${movie.id}`} aria-label={`More information about ${movie.title}`}>⌄</a>
      </div>
      {progress && <div className="stream-progress" aria-label={`${progress}% watched`}><i style={{ width: `${progress}%` }} /></div>}
    </div>
  </article>;
}

function StreamingRow({ title, eyebrow, movies, progress = false, actions }) {
  const trackRef = useRef(null);
  if (!movies.length) return null;

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * .82, behavior: "smooth" });
  };

  return <section className="stream-row">
    <header className="stream-row-heading">
      <div>{eyebrow && <span>{eyebrow}</span>}<h2>{title}</h2></div>
      <a href="/movies">Explore all <b>›</b></a>
    </header>
    <div className="stream-track-shell">
      <button className="stream-row-arrow stream-row-prev" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`}>‹</button>
      <div className="stream-track" ref={trackRef}>
        {movies.map((movie, index) => <StreamingCard
          key={`${title}-${movie.id}`}
          movie={movie}
          progress={progress ? 28 + ((index * 17) % 57) : null}
          favourite={actions.favourites.includes(movie.id)}
          saved={actions.watchlist.includes(movie.id)}
          onFavourite={actions.onFavourite}
          onWatchlist={actions.onWatchlist}
          onPlay={actions.onPlay}
        />)}
      </div>
      <button className="stream-row-arrow stream-row-next" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`}>›</button>
    </div>
  </section>;
}

export default function Home() {
  const {
    movies,
    favourites,
    watchlist,
    viewHistory,
    subscribe: addSubscriber,
    toggleFavourite,
    toggleWatchlist,
    playTrailer,
    playMovie,
    siteSettings,
  } = useMovies();
  const [email, setEmail] = useState("");
  const [subscribeError, setSubscribeError] = useState("");
  const published = movies.filter(movie => movie.status !== "Draft");
  const recentlyViewed = viewHistory.map(id => movies.find(movie => movie.id === id)).filter(Boolean);
  const topRated = [...published].sort((a, b) => b.rating - a.rating);
  const newReleases = [...published].sort((a, b) => b.year - a.year);
  const subscribe = (event) => {
    event.preventDefault();
    const result = addSubscriber(email);
    if (!result.ok) return setSubscribeError(result.message);
    setSubscribeError("");
    setEmail("");
  };

  const rowActions = {
    onFavourite: toggleFavourite,
    onWatchlist: toggleWatchlist,
    onPlay: movie => movie.videoUrl ? playMovie(movie) : playTrailer(movie),
  };

  return <main className="streaming-home">
    <MovieBanner />
    <div id="trending" className="stream-catalog">
      {siteSettings.showGenres && <nav className="stream-genre-nav" aria-label="Browse movie genres">
        <span>Explore</span>
        {[...new Set(published.map(movie => movie.genre))].slice(0, 6).map(genre =>
          <a key={genre} href={`/movies?genre=${encodeURIComponent(genre)}`}>{genre}</a>
        )}
      </nav>}

      {siteSettings.showContinueWatching && recentlyViewed.length > 0 && <StreamingRow
        eyebrow="Because you watched"
        title="Continue Watching"
        movies={recentlyViewed}
        progress
        actions={{
          ...rowActions,
          favourites,
          watchlist,
        }}
      />}

      {siteSettings.showTopRow && <StreamingRow
        eyebrow="What everyone is watching"
        title={siteSettings.topRowTitle}
        movies={topRated.slice(0, 10)}
        actions={{ ...rowActions, favourites, watchlist }}
      />}
      {siteSettings.showTrending && <StreamingRow
        title={siteSettings.trendingTitle}
        movies={published}
        actions={{ ...rowActions, favourites, watchlist }}
      />}
      {siteSettings.showNewReleases && <StreamingRow
        eyebrow="Fresh from the vault"
        title={siteSettings.newReleasesTitle}
        movies={newReleases}
        actions={{ ...rowActions, favourites, watchlist }}
      />}
      {siteSettings.showGenreRows && ["Sci-Fi", "Drama", "Thriller"].map(genre => <StreamingRow
        key={genre}
        title={`${genre} You Might Like`}
        movies={published.filter(movie => movie.genre === genre)}
        actions={{ ...rowActions, favourites, watchlist }}
      />)}

      {siteSettings.showNewsletter && <section className="stream-newsletter">
        <div>
          <span className="eyebrow">New every week</span>
          <h2>{siteSettings.newsletterTitle}</h2>
          <p>{siteSettings.newsletterCopy}</p>
        </div>
        <form onSubmit={subscribe}>
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="Email address" required />
          <button className="btn btn-primary">Get updates</button>
          {subscribeError && <small role="alert">{subscribeError}</small>}
        </form>
      </section>}
    </div>
  </main>;
}
