import MovieCard from "./MovieCard";
import useLanguage from "../../hooks/useLanguage";

export default function MovieGrid({ movies, emptyTitle = "No films found", emptyText = "Try another search." }) {
  const { t } = useLanguage();
  if (!movies.length) return <div className="empty-state"><b>{t("noFilms", emptyTitle)}</b><p>{emptyText}</p><a className="btn btn-primary" href="/movies">{t("discoverFilms", "Discover films")}</a></div>;
  return <>{movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</>;
}
