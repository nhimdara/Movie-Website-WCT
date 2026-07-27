import MovieGrid from "../components/movie/MovieGrid";
import useMovies from "../hooks/useMovies";
import useLanguage from "../hooks/useLanguage";

export default function Watchlist() {
  const { movies, watchlist } = useMovies();
  const { t } = useLanguage();
  return <main className="page-shell"><div className="container">
    <header className="page-intro"><span className="eyebrow">{t("savedLater", "Saved for later")}</span><h1>{t("yourWatchlist", "Your watchlist.")}</h1><p>{t("watchlistCopy", "Every film you want to see, held in one thoughtful queue.")}</p></header>
    <section className="movie-grid"><MovieGrid movies={movies.filter((movie) => watchlist.includes(movie.id))} emptyTitle="Your watchlist is empty" emptyText="Save films and they will wait for you here." /></section>
  </div></main>;
}
