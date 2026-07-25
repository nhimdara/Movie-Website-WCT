import MovieGrid from "../components/movie/MovieGrid";
import useMovies from "../hooks/useMovies";

export default function Watchlist() {
  const { movies, watchlist } = useMovies();
  return <main className="page-shell"><div className="container">
    <header className="page-intro"><span className="eyebrow">Saved for later</span><h1>Your<br />watchlist.</h1><p>Every film you want to see, held in one thoughtful queue.</p></header>
    <section className="movie-grid"><MovieGrid movies={movies.filter((movie) => watchlist.includes(movie.id))} emptyTitle="Your watchlist is empty" emptyText="Save films and they will wait for you here." /></section>
  </div></main>;
}
