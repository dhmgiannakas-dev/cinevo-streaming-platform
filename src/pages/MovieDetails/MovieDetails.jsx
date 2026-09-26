import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import ContentRow from "../../components/ContentRow/ContentRow";
import MyListContext from "../../context/MyListContext/MyListContext";
import { tmdbFetch } from "../../api/tmdb";
import "./MovieDetails.css";
import { SettingsContext } from "../../context/SettingsContext/SettingsContext";


function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToMyList, removeFromMyList, isInMyList } =
    useContext(MyListContext);

  const { autoplayTrailers } = useContext(SettingsContext);

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const controller = new AbortController();

    async function getDetails() {
      setMovie(null);
      setError(null);

      try {
        const [
          details,
          creditsDetails,
          videosDetails,
          recommendationsDetails,
        ] = await Promise.all([
          tmdbFetch(
            `/movie/${id}?language=en-US`,
            controller.signal
          ),

          tmdbFetch(
            `/movie/${id}/credits?language=en-US`,
            controller.signal
          ),

          tmdbFetch(
            `/movie/${id}/videos?language=en-US`,
            controller.signal
          ),

          tmdbFetch(
            `/movie/${id}/recommendations?language=en-US&page=1`,
            controller.signal
          ),
        ]);


        const trailer =
          videosDetails.results.find((video) => {
            return (
              video.type === "Trailer" &&
              video.site === "YouTube" &&
              video.official === true
            );
          }) ||
          videosDetails.results.find((video) => {
            return (
              video.type === "Trailer" &&
              video.site === "YouTube"
            );
          });


        const normalizedMovie = {
          id: details.id,
          title: details.title,
          overview: details.overview,

          poster: details.poster_path
            ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
            : null,

          backdrop: details.backdrop_path
            ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
            : null,

          releaseDate: details.release_date,

          genres: details.genres.map((genre) => {
            return genre.name;
          }),

          rating: details.vote_average,
          voteCount: details.vote_count,
          popularity: details.popularity,
          runtime: details.runtime,
          tagline: details.tagline,

          mediaType: "movie",
        };


        const normalizedCast = creditsDetails.cast.map((actor) => {
          return {
            id: actor.id,
            character: actor.character,
            name: actor.name,

            profile: actor.profile_path
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
              : null,
          };
        });


        const directorDetails = creditsDetails.crew.find((person) => {
          return person.job === "Director";
        });


        const normalizedDirector = directorDetails
          ? {
              id: directorDetails.id,
              name: directorDetails.name,

              profile: directorDetails.profile_path
                ? `https://image.tmdb.org/t/p/w185${directorDetails.profile_path}`
                : null,
            }
          : null;


        const normalizedRecommendations =
          recommendationsDetails.results.map((recommendation) => {
            return {
              id: recommendation.id,
              title: recommendation.title,

              poster: recommendation.poster_path
                ? `https://image.tmdb.org/t/p/w500${recommendation.poster_path}`
                : null,

              backdrop: recommendation.backdrop_path
                ? `https://image.tmdb.org/t/p/original${recommendation.backdrop_path}`
                : null,

              rating: recommendation.vote_average,
              releaseDate: recommendation.release_date,
              overview: recommendation.overview,

              mediaType: "movie",
            };
          });


        setMovie(normalizedMovie);
        setCast(normalizedCast);
        setDirector(normalizedDirector);
        setTrailerKey(trailer ? trailer.key : null);
        setRecommendations(normalizedRecommendations);

      } catch (error) {
        if (error.name === "AbortError") return;

        setError(error.message);
      }
    }


    getDetails();


    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });


    return () => {
      controller.abort();
    };

  }, [id]);


  function handleModal() {
    if (trailerKey) {
      setIsTrailerOpen(true);
    }
  }


  useEffect(() => {
    if (isTrailerOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }


    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsTrailerOpen(false);
      }
    }


    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [isTrailerOpen]);


if (error) {
  return (
    <main className="details-error">
      <div className="details-error-content">
        <div className="details-error-icon">!</div>

        <h2>Movie unavailable</h2>

        <p>
          We couldn't find this movie or load its details.
          It may no longer be available.
        </p>

        <Button
          onClick={() => navigate("/movies")}
          variant="contained"
          className="details-retry-btn"
        >
          Back to Movies
        </Button>
      </div>
    </main>
  );
}


  if (!movie) {
    return (
      <main className="details-loading">
        <div className="loading-spinner"></div>
      </main>
    );
  }


  const saved = isInMyList(movie.id, movie.mediaType);


  return (
    <main className="movie-details">

      {/* =========================
          HERO
      ========================= */}

      <section
        className="details-hero"
        style={{
          backgroundImage: movie.backdrop
            ? `url(${movie.backdrop})`
            : null,
        }}
      >
        <div className="details-overlay"></div>

        <IconButton
          className="details-back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton>


        <div className="details-content">

          <div className="details-poster">
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
              />
            ) : (
              <div className="details-poster-placeholder">
                No Image
              </div>
            )}
          </div>


          <div className="details-info">

            {movie.tagline && (
              <p className="details-tagline">
                {movie.tagline}
              </p>
            )}

            <h1>{movie.title}</h1>


            <div className="details-meta">

              {movie.releaseDate && (
                <span>
                  {movie.releaseDate.slice(0, 4)}
                </span>
              )}

              {movie.rating !== null ? (
                <span>
                  <StarIcon />
                  {movie.rating.toFixed(1)}
                </span>
              ) : (
                <span>N/A</span>
              )}

              {movie.runtime && (
                <span>
                  {Math.floor(movie.runtime / 60)}h{" "}
                  {movie.runtime % 60}m
                </span>
              )}

            </div>


            <div className="details-genres">
              {movie.genres.map((genre) => (
                <span key={genre}>
                  {genre}
                </span>
              ))}
            </div>


            <p className="details-overview">
              {movie.overview}
            </p>


            <div className="details-actions">

              <Button
                onClick={handleModal}
                variant="contained"
                startIcon={<PlayArrowIcon />}
                className="details-play-btn"
                disabled={!trailerKey}
              >
                Play
              </Button>


              <Button
                onClick={() => {
                  saved
                    ? removeFromMyList(
                        movie.id,
                        movie.mediaType
                      )
                    : addToMyList(movie);
                }}
                variant="outlined"
                startIcon={
                  saved
                    ? <CheckIcon />
                    : <AddIcon />
                }
                className="details-list-btn"
              >
                {saved ? "In My List" : "My List"}
              </Button>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          CAST
      ========================= */}

      <section className="details-cast">

        {director && (
          <div className="director-section">

            <h2>Director</h2>

            <div className="director-card">

              {director.profile ? (
                <img
                  src={director.profile}
                  alt={director.name}
                />
              ) : (
                <div className="director-placeholder">
                  {director.name.charAt(0)}
                </div>
              )}

              <div>
                <h3>{director.name}</h3>
                <p>Director</p>
              </div>

            </div>

          </div>
        )}


        {cast.length > 0 && (
          <div className="details-cast-section">

            <h2>Cast</h2>

            <div className="details-cast-list">

              {cast.slice(0, 8).map((actor) => (
                <article
                  className="details-cast-card"
                  key={actor.id}
                >

                  <div className="details-cast-image">

                    {actor.profile ? (
                      <img
                        src={actor.profile}
                        alt={actor.name}
                      />
                    ) : (
                      <div className="details-profile-placeholder">
                        {actor.name.charAt(0)}
                      </div>
                    )}

                  </div>


                  <div className="details-cast-info">
                    <h3>{actor.name}</h3>
                    <p>{actor.character}</p>
                  </div>

                </article>
              ))}

            </div>

          </div>
        )}

      </section>


      {/* =========================
          TRAILER
      ========================= */}

      {isTrailerOpen && trailerKey && (
        <div
          className="details-trailer-modal"
          onClick={() => setIsTrailerOpen(false)}
        >

          <div
            className="details-trailer-container"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >

            <button
              onClick={() => setIsTrailerOpen(false)}
            >
              X
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?${autoplayTrailers ? "autoplay=1" : "autoplay=0"}`}
              title={`${movie.title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />

          </div>

        </div>
      )}


      {/* =========================
          RECOMMENDATIONS
      ========================= */}

      {recommendations.length > 0 && (
        <ContentRow
          title="Recommendations"
          items={recommendations}
          type="movie"
        />
      )}

    </main>
  );
}


export default MovieDetails;