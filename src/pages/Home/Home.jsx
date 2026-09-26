import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../../context/SettingsContext/SettingsContext";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ContentRow from "../../components/ContentRow/ContentRow";
import { tmdbFetch } from "../../api/tmdb";
import "./Home.css";


function Home({
  movies,
  series,
  topRated,
  upcomingMovie,
  loading,
  error,
}) {
  const featuredMovie = movies[0];

  const navigate = useNavigate();

  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { autoplayTrailers } = useContext(SettingsContext);


  useEffect(() => {
    if (!isTrailerOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsTrailerOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTrailerOpen]);


  async function handlePlay() {
    if (!featuredMovie) return;

    try {
      const videosData = await tmdbFetch(
        `/movie/${featuredMovie.id}/videos?language=en-US`
      );

      const trailer =
        videosData.results.find((video) => {
          return (
            video.type === "Trailer" &&
            video.site === "YouTube" &&
            video.official === true
          );
        }) ||
        videosData.results.find((video) => {
          return (
            video.type === "Trailer" &&
            video.site === "YouTube"
          );
        });

      if (!trailer) return;

      setTrailerKey(trailer.key);
      setIsTrailerOpen(true);
    } catch {
      return;
    }
  }


  if (loading) {
    return (
      <main className="home-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>

          <p>Loading content...</p>
        </div>
      </main>
    );
  }


  if (error) {
    return (
      <main className="home-error">
        <div className="home-error-content">
          <div className="home-error-icon">!</div>

          <h2>Something went wrong</h2>

          <p>
            We couldn't load the content right now.
          </p>
        </div>
      </main>
    );
  }


  return (
    <main className="home">

      {/* =========================
          HERO
      ========================= */}

      <section
        className="hero"
        style={{
          backgroundImage: featuredMovie?.backdrop
            ? `url(${featuredMovie.backdrop})`
            : "none",
        }}
      >
        <div className="hero-overlay"></div>


        <div className="hero-content">

          <p className="hero-ranking">
            POPULAR NOW
          </p>


          <h1 className="hero-title">
            {featuredMovie?.title}
          </h1>


          <div className="hero-meta">

            {featuredMovie?.releaseDate && (
              <span>
                {featuredMovie.releaseDate.slice(0, 4)}
              </span>
            )}


            {featuredMovie?.rating !== undefined && (
              <span>
                <StarIcon />
                {featuredMovie.rating.toFixed(1)}
              </span>
            )}


            {featuredMovie?.genres?.[0] && (
              <span>
                {featuredMovie.genres[0]}
              </span>
            )}

          </div>


          <p className="hero-description">
            {featuredMovie?.overview}
          </p>


          <div className="hero-actions">

            <Button
              onClick={handlePlay}
              variant="contained"
              startIcon={<PlayArrowIcon />}
              className="hero-play-btn"
            >
              Play
            </Button>


            <Button
              onClick={() => {
                if (featuredMovie) {
                  navigate(`/movies/${featuredMovie.id}`);
                }
              }}
              variant="contained"
              startIcon={<InfoOutlinedIcon />}
              className="hero-info-btn"
            >
              More Info
            </Button>

          </div>

        </div>

      </section>


      {/* =========================
          CONTENT
      ========================= */}

      <ContentRow
        title="Popular Movies"
        items={movies}
        type="movie"
      />

      <ContentRow
        title="Popular Series"
        items={series}
        type="series"
      />

      <ContentRow
        title="Top Rated Movies"
        items={topRated}
        type="movie"
      />


      {/* =========================
          COMING SOON
      ========================= */}

      {upcomingMovie && (
        <section className="coming-soon-section">

          <div
            className="coming-soon"
            style={{
              backgroundImage: upcomingMovie.backdrop
                ? `url(${upcomingMovie.backdrop})`
                : "none",
            }}
          >

            <div className="coming-soon-overlay"></div>


            <div className="coming-soon-content">

              <p className="coming-soon-label">
                COMING SOON
              </p>


              <h2>
                {upcomingMovie.title}
              </h2>


              <div className="coming-soon-meta">

                {upcomingMovie.releaseDate && (
                  <span>
                    <CalendarMonthOutlinedIcon />

                    {new Date(
                      `${upcomingMovie.releaseDate}T00:00:00`
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}


                {upcomingMovie.genres
                  ?.filter(Boolean)
                  .slice(0, 2)
                  .map((genre) => (
                    <span key={genre}>
                      {genre}
                    </span>
                  ))}

              </div>


              <p className="coming-soon-description">
                {upcomingMovie.overview}
              </p>


              <Button
                onClick={() =>
                  navigate(`/movies/${upcomingMovie.id}`)
                }
                variant="contained"
                startIcon={<InfoOutlinedIcon />}
                className="coming-soon-btn"
              >
                More Info
              </Button>

            </div>

          </div>

        </section>
      )}


      {/* =========================
          TRAILER
      ========================= */}

      {isTrailerOpen && trailerKey && (
        <div
          className="home-trailer-modal"
          onClick={() => setIsTrailerOpen(false)}
        >

          <div
            className="home-trailer-container"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >

            <button
              onClick={() => setIsTrailerOpen(false)}
              aria-label="Close trailer"
            >
              X
            </button>


            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?${
                autoplayTrailers
                  ? "autoplay=1"
                  : "autoplay=0"
              }`}
              title={`${featuredMovie.title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />

          </div>

        </div>
      )}

    </main>
  );
}


export default Home;