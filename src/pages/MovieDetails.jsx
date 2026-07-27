import { useContext, useEffect, useState } from "react";
import { moviePoster } from "../data/movie";
import useMovies from "../hooks/useMovies";
import useLanguage from "../hooks/useLanguage";
import { AuthContext } from "../context/AuthContext";
import RatingStars from "../components/movie/RatingStars";
import { HeartIcon, PlayIcon, PlusIcon } from "../components/common/Icons";

export default function MovieDetails() {
  const { movies, favourites, watchlist, toggleFavourite, toggleWatchlist, playTrailer, playMovie, reviews, addReview, markViewed } = useMovies();
  const { t } = useLanguage();
  const { session } = useContext(AuthContext);
  const [reviewError, setReviewError] = useState("");
  const id = Number(new URLSearchParams(window.location.search).get("id")) || 1;
  const movie = movies.find((item) => item.id === id) || movies[0];
  useEffect(() => {
    if (movie?.id) markViewed(movie.id);
  }, [movie?.id, markViewed]);
  if (!movie) return <main className="page-shell"><div className="container empty-state"><b>{t("noFilms", "No published movies")}</b><p>{t("preparing", "Add and publish a movie from the admin dashboard.")}</p><a className="btn btn-primary" href="/">{t("returnHome", "Return home")}</a></div></main>;
  const approvedReviews = reviews.filter(review => review.movieId === movie.id && review.status === "approved");
  const submitReview = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (values.copy.trim().length < 10) return setReviewError("Write at least 10 characters.");
    addReview({ ...values, movieId: movie.id, movie: movie.title });
    setReviewError("");
    event.currentTarget.reset();
  };
  return <main>
    <section className="details-hero"><img className="details-backdrop" src={moviePoster(movie)} alt="" /><div className="details-content container">
      <span className="eyebrow">{movie.genre} · {movie.year}</span><h1>{movie.title}</h1><p>{movie.description}</p>
      <div className="meta-line"><RatingStars rating={movie.rating} /><span>{movie.duration}</span><span>PG-13</span></div>
      <div className="button-row">
        {movie.videoUrl && <button className="btn btn-primary" onClick={() => playMovie(movie)}><PlayIcon /> {t("watchMovie", "Watch movie")}</button>}
        <button className={movie.videoUrl ? "btn btn-ghost" : "btn btn-primary"} onClick={() => playTrailer(movie)}><PlayIcon /> {t("watchTrailer", "Watch trailer")}</button>
        <button className={`btn btn-ghost${watchlist.includes(id) ? " is-added" : ""}`} onClick={() => toggleWatchlist(id)}><PlusIcon checked={watchlist.includes(id)} /> Watchlist</button>
        <button className={`btn btn-ghost${favourites.includes(id) ? " is-added" : ""}`} onClick={() => toggleFavourite(id)}><HeartIcon filled={favourites.includes(id)} /> Favourite</button>
      </div>
    </div></section>
    <section className="details-body container"><div><span className="eyebrow">{t("story", "The story")}</span><h2>{t("aboutFilm", "About the film")}</h2><p>{movie.description}</p></div><aside className="facts">{[[t("director", "Director"), movie.director], [t("cast", "Cast"), movie.cast], [t("release", "Release"), movie.year], [t("runtime", "Runtime"), movie.duration], [t("genre", "Genre"), movie.genre], [t("score", "Score"), `${movie.rating} / 10`]].map(([label, value]) => <div key={label}><small>{label}</small><b>{value}</b></div>)}</aside></section>
    <section className="movie-reviews container">
      <div><span className="eyebrow">{t("community", "Community")}</span><h2>{t("viewerReviews", "Viewer reviews")}</h2>
        <div className="public-review-list">{approvedReviews.length ? approvedReviews.map(review => <article key={review.id}><header><b>{review.author}</b><span>★ {review.rating}</span></header><p>{review.copy}</p></article>) : <p className="no-reviews">{t("noReviews", "No approved reviews yet. Be the first to share your thoughts.")}</p>}</div>
      </div>
      <form className="review-form content-card" onSubmit={submitReview}><h3>{t("writeReview", "Write a review")}</h3>
        <div className="form-group"><label htmlFor="review-name">{t("name", "Name")}</label><input id="review-name" name="author" defaultValue={session?.name || ""} minLength="2" required/></div>
        <div className="form-group"><label htmlFor="review-rating">{t("rating", "Rating")}</label><select id="review-rating" name="rating" defaultValue="5">{[5,4.5,4,3.5,3,2.5,2,1.5,1].map(value => <option key={value} value={value}>{value}</option>)}</select></div>
        <div className="form-group"><label htmlFor="review-copy">{t("review", "Review")}</label><textarea id="review-copy" name="copy" minLength="10" required/></div>
        {reviewError && <p className="field-error" role="alert">{reviewError}</p>}<button className="btn btn-primary">{t("submitReview", "Submit for review")} →</button>
      </form>
    </section>
  </main>;
}
