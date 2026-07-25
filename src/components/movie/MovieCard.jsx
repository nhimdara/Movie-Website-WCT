import { moviePoster } from "../../data/movie";
import useMovies from "../../hooks/useMovies";
import RatingStars from "./RatingStars";
import { HeartIcon, PlayIcon, PlusIcon } from "../common/Icons";

export default function MovieCard({ movie }) {
  const { favourites, watchlist, toggleFavourite, toggleWatchlist, playTrailer } = useMovies();
  const favourite = favourites.includes(movie.id);
  const saved = watchlist.includes(movie.id);
  return <article className="movie-card">
    <div className="poster">
      <a href={`/movie?id=${movie.id}`}><img src={moviePoster(movie)} alt={`${movie.title} poster`} loading="lazy" decoding="async" /></a>
      <span className="card-genre">{movie.genre}</span>
      <div className="card-actions">
          <button className="round-action play-action" onClick={() => playTrailer(movie)} aria-label={`Play ${movie.title} trailer`}><PlayIcon /></button>
        <div>
          <button className={`round-action secondary${favourite ? " is-added" : ""}`} onClick={() => toggleFavourite(movie.id)} aria-label={`Toggle ${movie.title} favourite`}><HeartIcon filled={favourite} /></button>
          <button className={`round-action secondary${saved ? " is-added" : ""}`} onClick={() => toggleWatchlist(movie.id)} aria-label={`Toggle ${movie.title} watchlist`}><PlusIcon checked={saved} /></button>
        </div>
      </div>
    </div>
    <div className="card-copy"><div><h3><a href={`/movie?id=${movie.id}`}>{movie.title}</a></h3><span>{movie.year} · {movie.duration}</span></div><RatingStars rating={movie.rating} /></div>
  </article>;
}
