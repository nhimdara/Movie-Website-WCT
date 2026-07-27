import MovieGrid from "../components/movie/MovieGrid";
import useMovies from "../hooks/useMovies";
import useLanguage from "../hooks/useLanguage";

export default function Favourites() {
  const { movies, favourites } = useMovies();
  const { t } = useLanguage();
  return <main className="page-shell"><div className="container">
    <header className="page-intro"><span className="eyebrow">{t("yourCollection", "Your collection")}</span><h1>{t("filmsYouLove", "Films you love.")}</h1><p>{t("favouritesCopy", "Your personal gallery of stories worth returning to.")}</p></header>
    <section className="movie-grid"><MovieGrid movies={movies.filter((movie) => favourites.includes(movie.id))} emptyTitle="Your favourites are empty" emptyText="Tap the heart on a film you love." /></section>
  </div></main>;
}
