import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useMovies from "../hooks/useMovies";
import { MovieProvider } from "./MovieContext";

const wrapper = ({ children }) => <MovieProvider>{children}</MovieProvider>;

describe("MovieProvider catalogue actions", () => {
  it("adds and removes a movie from the watchlist", () => {
    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => result.current.toggleWatchlist(1));
    expect(result.current.watchlist).toContain(1);

    act(() => result.current.toggleWatchlist(1));
    expect(result.current.watchlist).not.toContain(1);
  });

  it("supports admin add, update, and delete actions", () => {
    const { result } = renderHook(() => useMovies(), { wrapper });
    let created;

    act(() => {
      created = result.current.addMovie({
        title: "Test Premiere",
        genre: "Drama",
        year: 2026,
        rating: 8,
        status: "published",
      });
    });
    expect(
      result.current.allMovies.some((movie) => movie.id === created.id),
    ).toBe(true);

    act(() =>
      result.current.updateMovie(created.id, { title: "Updated Premiere" }),
    );
    expect(
      result.current.allMovies.find((movie) => movie.id === created.id)?.title,
    ).toBe("Updated Premiere");

    act(() => result.current.deleteMovie(created.id));
    expect(
      result.current.allMovies.some((movie) => movie.id === created.id),
    ).toBe(false);
  });
});
