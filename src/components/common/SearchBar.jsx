import { useEffect, useMemo, useState } from "react";
import { moviePoster } from "../../data/movies";
import useMovies from "../../hooks/useMovies";

export default function SearchBar({ open, onClose }) {
  const { movies } = useMovies();
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return movies.slice(0, 4);
    return movies.filter(movie => `${movie.title} ${movie.genre} ${movie.year}`.toLowerCase().includes(term)).slice(0, 5);
  }, [movies, query]);

  useEffect(() => {
    if (!open) setQuery("");
    const closeOnEscape = event => event.key === "Escape" && onClose?.();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  return <div className={`search-panel${open ? " open" : ""}`} aria-hidden={!open}>
    <form className="container global-search-form" action="/movies">
      <label className="sr-only" htmlFor="global-search">Search movies</label>
      <input id="global-search" name="search" type="search" placeholder="Search by title, genre or year…" value={query} onChange={event => setQuery(event.target.value)} autoFocus={open} autoComplete="off"/>
      <button className="btn btn-primary">See all results <span>→</span></button>
    </form>
    <div className="container search-suggestions">
      <div className="search-suggestion-label"><span>{query ? "Matching titles" : "Popular now"}</span><small>{results.length} results</small></div>
      {results.length ? <div className="search-suggestion-grid">{results.map(movie => <a href={`/movie?id=${movie.id}`} key={movie.id} onClick={onClose}><img src={moviePoster(movie)} alt=""/><span><b>{movie.title}</b><small>{movie.year} · {movie.genre}</small></span><strong>★ {movie.rating}</strong></a>)}</div> : <p className="search-no-results">No movies match “{query}”.</p>}
    </div>
  </div>;
}
