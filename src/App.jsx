import { useState, useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { SettingsContext } from "./context/SettingsContext/SettingsContext";
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";
import Search from "./pages/Search/Search";
import Series from "./pages/Series/Series";
import Movies from "./pages/Movies/Movies";
import Home from "./pages/Home/Home";
import Mylist from "./pages/My-list/My-list";
import Settings from "./pages/Settings/Settings";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import SeriesDetails from "./pages/SeriesDetails/SeriesDetails";
import NotFound from "./pages/NotFound/NotFound";
import { tmdbFetch } from "./api/tmdb";
import "./App.css";


function App() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovie, setUpcomingMovie] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { reducedMotion, showMatureContent } = useContext(SettingsContext);


useEffect(() => {
  const controller = new AbortController();

  async function getMovies() {
    setLoading(true);
    setError(null);

    try {
      const [
        popularMovies,
        moviesGenres,
        tvSeries,
        seriesGenres,
        topMovies,
        upcomingMovies,
      ] = await Promise.all([
        tmdbFetch(
          `/movie/popular?language=en-US&include_adult=${showMatureContent}`,
          controller.signal
        ),

        tmdbFetch(
          "/genre/movie/list?language=en-US",
          controller.signal
        ),

        tmdbFetch(
          `/discover/tv?language=en-US&include_adult=${showMatureContent}`,
          controller.signal
        ),

        tmdbFetch(
          "/genre/tv/list?language=en-US",
          controller.signal
        ),

        tmdbFetch(
          `/movie/top_rated?language=en-US&include_adult=${showMatureContent}`,
          controller.signal
        ),

        tmdbFetch(
          `/movie/upcoming?language=en-US&page=1&include_adult=${showMatureContent}`,
          controller.signal
        ),
      ]);

      const normalizedMovies = popularMovies.results.map((movie) => {
        return {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,

          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,

          backdrop: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : null,

          releaseDate: movie.release_date,

          genres: movie.genre_ids.map((genreId) => {
            return moviesGenres.genres.find(
              (genre) => genre.id === genreId
            )?.name;
          }),

          rating: movie.vote_average,
          voteCount: movie.vote_count,
          popularity: movie.popularity,

          mediaType: "movie",
        };
      });

      const normalizedSeries = tvSeries.results.map((tv) => {
        return {
          id: tv.id,
          title: tv.name,
          overview: tv.overview,

          poster: tv.poster_path
            ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
            : null,

          backdrop: tv.backdrop_path
            ? `https://image.tmdb.org/t/p/original${tv.backdrop_path}`
            : null,

          releaseDate: tv.first_air_date,

          genres: tv.genre_ids.map((genreId) => {
            return seriesGenres.genres.find(
              (genre) => genre.id === genreId
            )?.name;
          }),

          rating: tv.vote_average,
          voteCount: tv.vote_count,
          popularity: tv.popularity,

          mediaType: "series",
        };
      });

      const normalizedTopRated = topMovies.results.map((top) => {
        return {
          id: top.id,
          title: top.title,
          overview: top.overview,

          poster: top.poster_path
            ? `https://image.tmdb.org/t/p/w500${top.poster_path}`
            : null,

          backdrop: top.backdrop_path
            ? `https://image.tmdb.org/t/p/original${top.backdrop_path}`
            : null,

          releaseDate: top.release_date,

          genres: top.genre_ids.map((genreId) => {
            return moviesGenres.genres.find(
              (genre) => genre.id === genreId
            )?.name;
          }),

          rating: top.vote_average,
          voteCount: top.vote_count,
          popularity: top.popularity,

          mediaType: "movie",
        };
      });

      const upcoming = upcomingMovies.results[0];

      const normalizedUpcoming = upcoming
        ? {
            id: upcoming.id,
            title: upcoming.title,
            overview: upcoming.overview,

            poster: upcoming.poster_path
              ? `https://image.tmdb.org/t/p/w500${upcoming.poster_path}`
              : null,

            backdrop: upcoming.backdrop_path
              ? `https://image.tmdb.org/t/p/original${upcoming.backdrop_path}`
              : null,

            releaseDate: upcoming.release_date,

            genres: upcoming.genre_ids.map((genreId) => {
              return moviesGenres.genres.find(
                (genre) => genre.id === genreId
              )?.name;
            }),

            rating: upcoming.vote_average,
            voteCount: upcoming.vote_count,
            popularity: upcoming.popularity,

            mediaType: "movie",
          }
        : null;

      setMovies(normalizedMovies);
      setSeries(normalizedSeries);
      setTopRatedMovies(normalizedTopRated);
      setUpcomingMovie(normalizedUpcoming);

    } catch (error) {
      if (error.name === "AbortError") return;

      setError(error);

    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }

  getMovies();

  return () => {
    controller.abort();
  };
}, [showMatureContent]);


  return (
    <div className={`app ${reducedMotion ? "reduced-motion" : ""}`}>

      <Sidebar />


      <Routes>

        <Route
          path="/"
          element={
            <Home
              movies={movies}
              series={series}
              topRated={topRatedMovies}
              upcomingMovie={upcomingMovie}
              loading={loading}
              error={error}
            />
          }
        />

        <Route
          path="/search"
          element={<Search />}
        />

        <Route
          path="/movies"
          element={<Movies />}
        />

        <Route
          path="/movies/:id"
          element={<MovieDetails />}
        />

        <Route
          path="/series"
          element={<Series />}
        />

        <Route
          path="/series/:id"
          element={<SeriesDetails />}
        />

        <Route
          path="/my-list"
          element={<Mylist />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="*" 
          element={<NotFound />} 
        />

      </Routes>

      <Footer />

    </div>
  );
}


export default App;