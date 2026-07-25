export const MOVIE_STORE = {
  key: "cinevault-movies",
  version: 1,
};

export const MOVIE_DEFAULTS = {
  title: "",
  year: new Date().getFullYear(),
  duration: "",
  genre: "Drama",
  rating: 0,
  image: "",
  poster: "",
  trailerUrl: "",
  videoUrl: "",
  description: "",
  director: "",
  cast: "",
  status: "published",
  createdAt: "",
  updatedAt: "",
};

export function createMovieRecord(movie = {}) {
  return {
    ...MOVIE_DEFAULTS,
    ...movie,
    id: Number(movie.id) || 0,
    year: Number(movie.year) || MOVIE_DEFAULTS.year,
    rating: Number(movie.rating) || 0,
  };
}

const movieRecords = [
  {
    id: 1,
    title: "Beyond the Horizon",
    year: 2026,
    duration: "2h 18m",
    genre: "Sci-Fi",
    rating: 9.2,
    image: "movie-1.jpg",
    description:
      "An explorer follows a mysterious signal through a fractured corner of space, risking everything for a final chance at home.",
    director: "Mara Venn",
    cast: "Lena Cross, Theo Vale, Imani Reed",
  },
  {
    id: 2,
    title: "Neon Abyss",
    year: 2025,
    duration: "1h 49m",
    genre: "Thriller",
    rating: 8.7,
    image: "movie-2.jpg",
    description:
      "A courier discovers the package she is carrying can rewrite the memories of an entire city.",
    director: "Eli Warren",
    cast: "Sora Lane, Mark Enzo",
  },
  {
    id: 3,
    title: "Dayfall",
    year: 2024,
    duration: "2h 05m",
    genre: "Drama",
    rating: 8.4,
    image: "movie-3.jpg",
    description:
      "Two estranged sisters return to their coastal hometown on the longest day of the year.",
    director: "Nadia Sol",
    cast: "Mira Stone, Adele Park",
  },
  {
    id: 4,
    title: "The Fractured Look",
    year: 2026,
    duration: "1h 58m",
    genre: "Thriller",
    rating: 8.9,
    image: "movie-4.jpg",
    description:
      "A celebrated photographer sees a crime hidden inside one of her unfinished portraits.",
    director: "Jonas Rook",
    cast: "Eva Nox, Colin North",
  },
  {
    id: 5,
    title: "The Last Signal",
    year: 2026,
    duration: "2h 12m",
    genre: "Sci-Fi",
    rating: 9.1,
    image: "movie-5.jpg",
    description:
      "At the end of the world, an isolated radio operator receives a transmission that should not exist.",
    director: "Amara Quinn",
    cast: "Naomi Bell, Erik Moss",
  },
  {
    id: 6,
    title: "Silent Rise",
    year: 2023,
    duration: "1h 26m",
    genre: "Documentary",
    rating: 8.5,
    image: "movie-6.jpg",
    description:
      "An intimate study of four climbers attempting an uncharted winter ascent.",
    director: "Cole Mercer",
    cast: "Ari Chen, Luca Gray",
  },
  {
    id: 7,
    title: "Obsidian Luxury",
    year: 2025,
    duration: "1h 54m",
    genre: "Drama",
    rating: 8.2,
    image: "movie-7.jpg",
    description:
      "A hotel concierge becomes the only witness to a billionaire's carefully staged disappearance.",
    director: "Yuki Aster",
    cast: "June Ko, Anton Reyes",
  },
  {
    id: 8,
    title: "Shift at Midnight",
    year: 2024,
    duration: "1h 42m",
    genre: "Thriller",
    rating: 8.0,
    image: "movie-8.jpg",
    description:
      "A night-shift paramedic realizes every emergency call is leading her toward the same address.",
    director: "Faye Holt",
    cast: "Liv Mercer, Ben Rami",
  },
  {
    id: 9,
    title: "Shattered Sky",
    year: 2026,
    duration: "2h 27m",
    genre: "Adventure",
    rating: 8.8,
    image: "movie-9.jpg",
    description:
      "A crew of storm pilots crosses a world where the atmosphere is breaking apart.",
    director: "Rian West",
    cast: "Iris Kane, Sol Quinn",
  },
  {
    id: 10,
    title: "The Climb",
    year: 2023,
    duration: "1h 40m",
    genre: "Documentary",
    rating: 7.9,
    image: "movie-10.jpg",
    description:
      "A breathtaking account of endurance, friendship and impossible vertical terrain.",
    director: "Milo Hart",
    cast: "Tess Morgan, Kai Young",
  },
  {
    id: 11,
    title: "Ember Protocol",
    year: 2025,
    duration: "2h 15m",
    genre: "Sci-Fi",
    rating: 8.6,
    image: "movie-11.jpg",
    description:
      "The last firefighter on Mars uncovers the code that started a planet-wide catastrophe.",
    director: "Celeste Wynn",
    cast: "Nico Rhodes, Sana Bell",
  },
  {
    id: 12,
    title: "Dark Passage",
    year: 2024,
    duration: "1h 50m",
    genre: "Adventure",
    rating: 8.1,
    image: "movie-12.jpg",
    description:
      "A cartographer enters an underground ocean to find a missing expedition.",
    director: "Oren Pike",
    cast: "Maya Voss, Ren Cole",
  },
];

// Demo playback sources for the fictional seed catalogue. Replace these with
// the real YouTube links for each movie when they are available.
const demoYouTubeVideos = [
  "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  "https://www.youtube.com/watch?v=eRsGyueVLvQ",
  "https://www.youtube.com/watch?v=R6MlUcmOul8",
  "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
];

// This is the complete seed catalogue. Every exported record contains every
// field defined in MOVIE_DEFAULTS, including trailer, poster and publish state.
const movies = movieRecords.map((movie, index) => createMovieRecord({
  ...movie,
  trailerUrl: demoYouTubeVideos[index % demoYouTubeVideos.length],
  videoUrl: demoYouTubeVideos[(index + 1) % demoYouTubeVideos.length],
}));

export const genres = [
  "Sci-Fi",
  "Drama",
  "Thriller",
  "Adventure",
  "Documentary",
];
export const moviePoster = (movie) => {
  const source = movie?.poster || movie?.image || "movie-1.jpg";
  return /^(https?:|data:|blob:|\/)/i.test(source)
    ? source
    : `/images/movies/${source}`;
};
export default movies;
