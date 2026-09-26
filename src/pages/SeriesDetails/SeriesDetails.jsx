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
import "./SeriesDetails.css";
import { SettingsContext } from "../../context/SettingsContext/SettingsContext";


function SeriesDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToMyList, removeFromMyList, isInMyList } =
    useContext(MyListContext);

  const { autoplayTrailers } = useContext(SettingsContext); 

  const [series, setSeries] = useState(null);
  const [cast, setCast] = useState([]);
  const [creator, setCreator] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const controller = new AbortController();

    async function getDetails() {
      setSeries(null);
      setError(null);

      try {
        const [
          details,
          creditsDetails,
          videosDetails,
          recommendationsDetails,
        ] = await Promise.all([
          tmdbFetch(
            `/tv/${id}?language=en-US`,
            controller.signal
          ),

          tmdbFetch(
            `/tv/${id}/credits?language=en-US`,
            controller.signal
          ),

          tmdbFetch(
            `/tv/${id}/videos?language=en-US`,
            controller.signal
          ),

          tmdbFetch(
            `/tv/${id}/recommendations?language=en-US&page=1`,
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


        const normalizedSeries = {
          id: details.id,
          title: details.name,
          overview: details.overview,

          poster: details.poster_path
            ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
            : null,

          backdrop: details.backdrop_path
            ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
            : null,

          releaseDate: details.first_air_date,

          genres: details.genres.map((genre) => {
            return genre.name;
          }),

          rating: details.vote_average,
          voteCount: details.vote_count,
          popularity: details.popularity,
          tagline: details.tagline,
          seasons: details.number_of_seasons,
          episodes: details.number_of_episodes,
          status: details.status,

          mediaType: "series",
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


        const firstCreator = details.created_by?.[0];


        const normalizedCreator = firstCreator
          ? {
              id: firstCreator.id,
              name: firstCreator.name,

              profile: firstCreator.profile_path
                ? `https://image.tmdb.org/t/p/w185${firstCreator.profile_path}`
                : null,
            }
          : null;


        const normalizedRecommendations =
          recommendationsDetails.results.map((recommendation) => {
            return {
              id: recommendation.id,
              title: recommendation.name,

              poster: recommendation.poster_path
                ? `https://image.tmdb.org/t/p/w500${recommendation.poster_path}`
                : null,

              backdrop: recommendation.backdrop_path
                ? `https://image.tmdb.org/t/p/original${recommendation.backdrop_path}`
                : null,

              rating: recommendation.vote_average,
              releaseDate: recommendation.first_air_date,
              overview: recommendation.overview,

              mediaType: "series",
            };
          });


        setSeries(normalizedSeries);
        setCast(normalizedCast);
        setCreator(normalizedCreator);
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

        <h2>Series unavailable</h2>

        <p>
          We couldn't find this series or load its details.
          It may no longer be available.
        </p>

        <Button
          onClick={() => navigate("/series")}
          variant="contained"
          className="details-retry-btn"
        >
          Back to Series
        </Button>
      </div>
    </main>
  );
}


  if (!series) {
    return (
      <main className="series-loading">
        <div className="loading-spinner"></div>
      </main>
    );
  }


  const saved = isInMyList(series.id, series.mediaType);


  return (
    <main className="series-details">

      {/* =========================
          HERO
      ========================= */}

      <section
        className="series-hero"
        style={{
          backgroundImage: series.backdrop
            ? `url(${series.backdrop})`
            : null,
        }}
      >
        <div className="series-overlay"></div>


        <IconButton
          className="series-back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton>


        <div className="series-content">

          <div className="series-poster">

            {series.poster ? (
              <img
                src={series.poster}
                alt={series.title}
              />
            ) : (
              <div className="series-poster-placeholder">
                No Image
              </div>
            )}

          </div>


          <div className="series-info">

            {series.tagline && (
              <p className="series-tagline">
                {series.tagline}
              </p>
            )}


            <h1>{series.title}</h1>


            <div className="series-meta">

              {series.releaseDate && (
                <span>
                  {series.releaseDate.slice(0, 4)}
                </span>
              )}


              {series.rating !== null ? (
                <span>
                  <StarIcon />
                  {series.rating.toFixed(1)}
                </span>
              ) : (
                <span>N/A</span>
              )}


              {series.seasons && (
                <span>
                  {series.seasons}{" "}
                  {series.seasons === 1
                    ? "Season"
                    : "Seasons"}
                </span>
              )}


              {series.status && (
                <span>{series.status}</span>
              )}

            </div>


            <div className="series-genres">

              {series.genres.map((genre) => (
                <span key={genre}>
                  {genre}
                </span>
              ))}

            </div>


            <p className="series-overview">
              {series.overview}
            </p>


            <div className="series-actions">

              <Button
                onClick={handleModal}
                variant="contained"
                startIcon={<PlayArrowIcon />}
                className="series-play-btn"
                disabled={!trailerKey}
              >
                Play
              </Button>


              <Button
                onClick={() => {
                  saved
                    ? removeFromMyList(
                        series.id,
                        series.mediaType
                      )
                    : addToMyList(series);
                }}
                variant="outlined"
                startIcon={
                  saved
                    ? <CheckIcon />
                    : <AddIcon />
                }
                className="series-list-btn"
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

      <section className="series-cast">

        {creator && (
          <div className="creator-section">

            <h2>Creator</h2>


            <div className="creator-card">

              {creator.profile ? (
                <img
                  src={creator.profile}
                  alt={creator.name}
                />
              ) : (
                <div className="creator-placeholder">
                  {creator.name.charAt(0)}
                </div>
              )}


              <div>
                <h3>{creator.name}</h3>
                <p>Creator</p>
              </div>

            </div>

          </div>
        )}


        {cast.length > 0 && (
          <div className="series-cast-section">

            <h2>Cast</h2>


            <div className="series-cast-list">

              {cast.slice(0, 8).map((actor) => (
                <article
                  className="series-cast-card"
                  key={actor.id}
                >

                  <div className="series-cast-image">

                    {actor.profile ? (
                      <img
                        src={actor.profile}
                        alt={actor.name}
                      />
                    ) : (
                      <div className="series-profile-placeholder">
                        {actor.name.charAt(0)}
                      </div>
                    )}

                  </div>


                  <div className="series-cast-info">
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
          className="series-trailer-modal"
          onClick={() => setIsTrailerOpen(false)}
        >

          <div
            className="series-trailer-container"
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
              title={`${series.title} trailer`}
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
          type="series"
        />
      )}

    </main>
  );
}


export default SeriesDetails;