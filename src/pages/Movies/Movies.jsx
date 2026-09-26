import { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext/SettingsContext";
import MovieCard from "../../components/MovieCard/MovieCard";
import SkeletonCards from "../../components/SkeletonCards/SkeletonCards";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { tmdbFetch } from "../../api/tmdb";
import "./Movies.css"



function Movies() {

    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(null);
    const [sortBy, setSortBy] = useState("popularity.desc");

    const { showMatureContent, reducedMotion } = useContext(SettingsContext);

    useEffect(() => {

        const today = new Date().toISOString().split('T')[0];

        if (genres.length === 0) return;

        const controller = new AbortController();

        async function getFullMovies() {


            setLoading(true);
            setError(null);

            try {
                const moviesFullList = await
                    tmdbFetch(`/discover/movie?language=en-US&page=${page}&sort_by=${sortBy}${sortBy === "vote_average.desc" ? "&vote_count.gte=200" : ""}${sortBy === "primary_release_date.desc" ? `&primary_release_date.lte=${today}&vote_count.gte=10` : ""}${sortBy === "primary_release_date.asc"? "&vote_count.gte=50" : ""}${selectedGenre !== null ? `&with_genres=${selectedGenre}` : ""}&include_adult=${showMatureContent}`, controller.signal);


                setTotal(moviesFullList.total_pages);

                const normalizedMoviesFull = moviesFullList.results.map((movie) => {
                    return {
                        id: movie.id,
                        title: movie.title ? movie.title : null,
                        overview: movie.overview ? movie.overview : null,
                        releaseDate: movie.release_date,
                        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                        backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
                        rating: movie.vote_average,
                        voteCount: movie.vote_count,
                        popularity: movie.popularity,
                        genres: movie.genre_ids.map((genreId) => {
                            return genres.find(
                                (genre) => genre.id === genreId
                            )?.name;
                        }),
                        mediaType: "movie",
                    }
                })

                setMovies(normalizedMoviesFull);


            } catch (error) {
                if (error.name === "AbortError") {
                    return;
                }
                setError(error);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }

        }

        getFullMovies();

        return () => {
            controller.abort();
        }
    }, [selectedGenre, genres, page, sortBy, showMatureContent]);

    useEffect(() => {

        const controller = new AbortController();

        async function getGenres() {
            try {
                const genresFullList = await tmdbFetch(`/genre/movie/list?language=en-US`, controller.signal);


                setGenres(genresFullList.genres);
            } catch (error) {
                if (error.name === "AbortError") {
                    return;
                }
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
        if (page === 1) {
            return;
        }
        setPage(page - 1);
    };

    function handleNext() {
        if (page === total) {
            return;
        }
        setPage(page + 1);
    };

    return (
        <main>
            <div className="movies-genres">
                <button
                    className={`genre-chip ${selectedGenre === null ? "active" : ""}`}
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
                        className={`genre-chip ${selectedGenre === genre.id ? "active" : ""}`}
                        onClick={() => {
                            setSelectedGenre(genre.id);
                            setPage(1);
                        }}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>

            <div className="movies-sort">
                <label htmlFor="sort">Sort by:</label>

                <select 
                id= "sort"
                value={sortBy}
                onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                }}>
                    <option value={"popularity.desc"}>Popularity</option>
                    <option value={"vote_average.desc"}>Rating</option>
                    <option value={"primary_release_date.desc"}>Newest</option>
                    <option value={"primary_release_date.asc"}>Oldest</option>
                </select>
            </div>

            <div className="movies-grid">
                {loading ? (
                    Array.from({ length: 20 }).map((_, index) => (
                        <SkeletonCards key={index} />
                    ))
                ) : error ? (
                    <div className="movies-error">
                        <h2>Something went wrong</h2>
                        <p>We couldn't load the movies. Please try again.</p>
                    </div>
                ) : (
                    movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                        />
                    ))
                )}
            </div>

            <div className="movies-pagination">
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


export default Movies;