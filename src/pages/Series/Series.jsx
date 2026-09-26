import "./Series.css";
import SeriesCard from "../../components/SeriesCard/SeriesCard";
import SkeletonCards from "../../components/SkeletonCards/SkeletonCards";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { tmdbFetch } from "../../api/tmdb";
import { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext/SettingsContext";

function Series() {
  const [series, setSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [sortBy, setSortBy] = useState("popularity.desc");

  const { showMatureContent, reducedMotion } = useContext(SettingsContext);


  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    if (genres.length === 0) return;

    const controller = new AbortController();

    async function getSeries() {
      setLoading(true);
      setError(null);

      try {
        const seriesFullList = await tmdbFetch(
          `/discover/tv?language=en-US&page=${page}&sort_by=${sortBy}${sortBy === "vote_average.desc" ? "&vote_count.gte=200" : ""}${sortBy === "first_air_date.desc" ? `&first_air_date.lte=${today}&vote_count.gte=10` : ""}${sortBy === "first_air_date.asc" ? "&vote_count.gte=50" : ""}${selectedGenre !== null ? `&with_genres=${selectedGenre}` : ""}&include_adult=${showMatureContent}`,
          controller.signal
        );

        setTotal(seriesFullList.total_pages);

        const normalizedSeriesFull = seriesFullList.results.map((item) => {
          return {
            id: item.id,
            title: item.name ? item.name : null,
            overview: item.overview ? item.overview : null,
            releaseDate: item.first_air_date,
            poster: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : null,
            backdrop: item.backdrop_path
              ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
              : null,
            rating: item.vote_average,
            voteCount: item.vote_count,
            popularity: item.popularity,
            genres: item.genre_ids.map((genreId) => {
              return genres.find(
                (genre) => genre.id === genreId
              )?.name;
            }),
            mediaType: "series",
          };
        });

        setSeries(normalizedSeriesFull);

      } catch (error) {
        if (error.name === "AbortError") return;

        setError(error);

      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getSeries();

    return () => {
      controller.abort();
    };
  }, [genres, selectedGenre, page, sortBy, showMatureContent]);


  useEffect(() => {
    const controller = new AbortController();

    async function getGenres() {
      try {
        const genresFullList = await tmdbFetch(
          "/genre/tv/list?language=en-US",
          controller.signal
        );

        setGenres(genresFullList.genres);

      } catch (error) {
        if (error.name === "AbortError") return;

        setError(error);
      }
    }

    getGenres();

    return () => {
      controller.abort();
    };
  }, []);


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  }, [page, reducedMotion]);


  useEffect(() => {
  setPage(1);
}, [showMatureContent]);


  function handlePrevious() {
    if (page === 1) return;

    setPage(page - 1);
  }


  function handleNext() {
    if (page === total) return;

    setPage(page + 1);
  }


  return (
    <main>
      <div className="series-genres">
        <button
          className={`series-genre-chip ${
            selectedGenre === null ? "active" : ""
          }`}
          onClick={() => {
            setSelectedGenre(null);
            setPage(1);
          }}
        >
          All
        </button>

        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`series-genre-chip ${
              selectedGenre === genre.id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedGenre(genre.id);
              setPage(1);
            }}
          >
            {genre.name}
          </button>
        ))}
      </div>


      <div className="series-sort">
        <label htmlFor="sort">Sort by:</label>

        <select
          id="sort"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
        >
          <option value="popularity.desc">Popularity</option>
          <option value="vote_average.desc">Rating</option>
          <option value="first_air_date.desc">Newest</option>
          <option value="first_air_date.asc">Oldest</option>
        </select>
      </div>


      <div className="series-grid">
        {loading ? (
          Array.from({ length: 20 }).map((_, index) => (
            <SkeletonCards key={index} />
          ))
        ) : error ? (
          <div className="series-error">
            <h2>Something went wrong</h2>
            <p>We couldn't load the series. Please try again.</p>
          </div>
        ) : (
          series.map((item) => (
            <SeriesCard
              key={item.id}
              tv={item}
            />
          ))
        )}
      </div>


      <div className="series-pagination">
        <Button
          disabled={page === 1}
          onClick={handlePrevious}
          className="pagination-btn"
          startIcon={<ArrowBackIosNewIcon />}
        >
          Previous
        </Button>

        <span className="pagination-page">
          Page {page}
        </span>

        <Button
          disabled={page === total}
          onClick={handleNext}
          className="pagination-btn"
          endIcon={<ArrowForwardIosIcon />}
        >
          Next
        </Button>
      </div>
    </main>
  );
}

export default Series;