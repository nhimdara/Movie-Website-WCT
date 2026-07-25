import MovieGrid from "../components/movie/MovieGrid";
import useMovies from "../hooks/useMovies";

export default function Favourites() {
  const { movies, favourites } = useMovies();
  return <main className="page-shell"><div className="container">
    <header className="page-intro"><span className="eyebrow">Your collection</span><h1>Films you<br />love.</h1><p>Your personal gallery of stories worth returning to.</p></header>
    <section className="movie-grid"><MovieGrid movies={movies.filter((movie) => favourites.includes(movie.id))} emptyTitle="Your favourites are empty" emptyText="Tap the heart on a film you love." /></section>
  </div></main>;
}
