import MovieCard from "./MovieCard";

export default function MovieGrid({ movies, emptyTitle = "No films found", emptyText = "Try another search." }) {
  if (!movies.length) return <div className="empty-state"><b>{emptyTitle}</b><p>{emptyText}</p><a className="btn btn-primary" href="/movies">Discover films</a></div>;
  return <>{movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</>;
}
