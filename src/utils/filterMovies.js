export default function filterMovies(
  movies,
  { search = "", genre = "", sort = "rating" },
) {
  const term = search.trim().toLowerCase();
  return movies
    .filter((movie) =>
      `${movie.title} ${movie.genre} ${movie.year}`
        .toLowerCase()
        .includes(term),
    )
    .filter((movie) => !genre || movie.genre === genre)
    .sort((a, b) => {
      if (sort === "newest") return b.year - a.year;
      if (sort === "title") return a.title.localeCompare(b.title);
      return b.rating - a.rating;
    });
}
