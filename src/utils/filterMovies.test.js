import { describe, expect, it } from "vitest";
import filterMovies from "./filterMovies";

const movies = [
  { id: 1, title: "Orbit", genre: "Science Fiction", year: 2026, rating: 8.8 },
  { id: 2, title: "After Rain", genre: "Drama", year: 2024, rating: 9.1 },
  { id: 3, title: "Night Run", genre: "Thriller", year: 2025, rating: 7.9 },
];

describe("filterMovies", () => {
  it("searches titles and genres without changing the source list", () => {
    const source = [...movies];
    expect(filterMovies(movies, { search: "science fiction" })).toEqual([
      movies[0],
    ]);
    expect(movies).toEqual(source);
  });

  it("filters by genre and supports each sort mode", () => {
    expect(filterMovies(movies, { genre: "Drama" })).toEqual([movies[1]]);
    expect(
      filterMovies(movies, { sort: "newest" }).map((movie) => movie.id),
    ).toEqual([1, 3, 2]);
    expect(
      filterMovies(movies, { sort: "title" }).map((movie) => movie.id),
    ).toEqual([2, 3, 1]);
  });
});
