import { useRef, useState } from "react";
import { HeartIcon, PlayIcon, PlusIcon } from "../components/common/Icons";
import MovieBanner from "../components/movie/MovieBanner";
import { moviePoster } from "../data/movie";
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
        <img src={moviePoster(movie)} alt="" loading="lazy" decoding="async" />
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

function EditorialSpotlight({ movie, onPlay, saved, onWatchlist }) {
  if (!movie) return null;

  return <section className="editorial-spotlight" aria-labelledby="editorial-title">
    <div className="editorial-art">
      <img src={moviePoster(movie)} alt="" loading="lazy" decoding="async" />
      <div className="editorial-score">
        <small>Audience score</small>
        <b>{Math.round(movie.rating * 10)}<span>%</span></b>
      </div>
    </div>
    <div className="editorial-copy">
      <span className="eyebrow">The editor&apos;s cut</span>
      <h2 id="editorial-title">One film.<br /><em>Worth your night.</em></h2>
      <h3>{movie.title}</h3>
      <p>{movie.description}</p>
      <dl>
        <div><dt>Genre</dt><dd>{movie.genre}</dd></div>
        <div><dt>Released</dt><dd>{movie.year}</dd></div>
        <div><dt>Runtime</dt><dd>{movie.duration}</dd></div>
      </dl>
      <div className="button-row">
        <button className="btn btn-primary" onClick={() => onPlay(movie)}><PlayIcon /> Watch now</button>
        <button className={`btn editorial-save${saved ? " is-added" : ""}`} onClick={() => onWatchlist(movie.id)}>
          <PlusIcon checked={saved} /> {saved ? "In my list" : "Add to list"}
        </button>
        <a className="editorial-link" href={`/movie?id=${movie.id}`}>Read the story <span>↗</span></a>
      </div>
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
  const genres = [...new Set(published.map(movie => movie.genre))].slice(0, 6);
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
    favourites,
    watchlist,
  };

  return <main className="streaming-home">
    <MovieBanner />
    <div id="trending" className="stream-catalog">
      {siteSettings.showGenres && <nav className="stream-genre-nav" aria-label="Browse movie genres">
        <span>Explore</span>
        {genres.map(genre =>
          <a key={genre} href={`/movies?genre=${encodeURIComponent(genre)}`}>{genre}</a>
        )}
      </nav>}

      <aside className="stream-discovery-bar" aria-label="CineVault collection summary">
        <div className="discovery-intro">
          <i aria-hidden="true" />
          <span><b>Curated for tonight</b><small>Hand-picked stories, no endless scrolling</small></span>
        </div>
        <dl>
          <div><dt>Films</dt><dd>{published.length}</dd></div>
          <div><dt>Genres</dt><dd>{genres.length}</dd></div>
          <div><dt>Top score</dt><dd>{topRated[0]?.rating ?? "—"}</dd></div>
        </dl>
        <a href="/movies">Browse the vault <span aria-hidden="true">↗</span></a>
      </aside>

      {siteSettings.showContinueWatching && recentlyViewed.length > 0 && <StreamingRow
        eyebrow="Because you watched"
        title="Continue Watching"
        movies={recentlyViewed}
        progress
        actions={rowActions}
      />}

      {siteSettings.showTopRow && <StreamingRow
        eyebrow="What everyone is watching"
        title={siteSettings.topRowTitle}
        movies={topRated.slice(0, 10)}
        actions={rowActions}
      />}
      <EditorialSpotlight
        movie={topRated[0]}
        onPlay={rowActions.onPlay}
        saved={topRated[0] ? watchlist.includes(topRated[0].id) : false}
        onWatchlist={toggleWatchlist}
      />
      {siteSettings.showTrending && <StreamingRow
        title={siteSettings.trendingTitle}
        movies={published}
        actions={rowActions}
      />}
      {siteSettings.showNewReleases && <StreamingRow
        eyebrow="Fresh from the vault"
        title={siteSettings.newReleasesTitle}
        movies={newReleases}
        actions={rowActions}
      />}
      {siteSettings.showGenreRows && ["Science Fiction", "Drama", "Thriller"].map(genre => <StreamingRow
        key={genre}
        title={`${genre} You Might Like`}
        movies={published.filter(movie => movie.genre === genre)}
        actions={rowActions}
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
