import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { tmdbFetch } from "../../api/tmdb";
import SkeletonCards from "../../components/SkeletonCards/SkeletonCards";
import "./Search.css";
import { SettingsContext } from "../../context/SettingsContext/SettingsContext";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showMatureContent } = useContext(SettingsContext);

  const navigate = useNavigate();


  useEffect(() => {
    const controller = new AbortController();

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);

      return () => {
        controller.abort();
      };
    }

    async function searchContent() {
      setLoading(true);
      setError(null);

      try {
        const searchData = await tmdbFetch(
          `/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=${showMatureContent}`,
          controller.signal
        );

        const normalizedResults = searchData.results
          .filter((item) => {
            return (
              item.media_type === "movie" ||
              item.media_type === "tv"
            );
          })
          .map((item) => {
            return {
              id: item.id,

              title:
                item.media_type === "movie"
                  ? item.title
                  : item.name,

              poster: item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : null,

              backdrop: item.backdrop_path
                ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
                : null,

              releaseDate:
                item.media_type === "movie"
                  ? item.release_date
                  : item.first_air_date,

              rating: item.vote_average,

              mediaType:
                item.media_type === "tv"
                  ? "series"
                  : "movie",
            };
          });

        setResults(normalizedResults);

      } catch (error) {
        if (error.name === "AbortError") return;

        setError(error);

      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }


    const timer = setTimeout(() => {
      searchContent();
    }, 500);


    return () => {
      clearTimeout(timer);
      controller.abort();
    };

  }, [query, showMatureContent]);


  function handleResultClick(item) {
    if (item.mediaType === "movie") {
      navigate(`/movies/${item.id}`);
    } else {
      navigate(`/series/${item.id}`);
    }
  }


  return (
    <main className="search-page">
      <div className="search-header">
        <h1>Search</h1>

        <input
          type="text"
          placeholder="Search movies and series..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>


      {loading ? (
        <div className="search-grid">
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCards key={index} />
          ))}
        </div>

      ) : error ? (
        <div className="search-message">
          <h2>Something went wrong</h2>
          <p>We couldn't complete your search. Please try again.</p>
        </div>

      ) : query.trim() && results.length === 0 ? (
        <div className="search-message">
          <h2>No results found</h2>
          <p>Try searching for something else.</p>
        </div>

      ) : results.length > 0 ? (
        <div className="search-grid">
          {results.map((item) => (
            <article
              key={`${item.mediaType}-${item.id}`}
              className="search-card"
              onClick={() => handleResultClick(item)}
            >
              {item.poster ? (
                <img
                  src={item.poster}
                  alt={item.title}
                />
              ) : (
                <div className="search-no-poster">
                  <span>No image available</span>
                </div>
              )}

              <div className="search-card-info">
                <h3>{item.title}</h3>

                <div className="search-card-meta">
                  <span>
                    {item.mediaType === "movie"
                      ? "Movie"
                      : "Series"}
                  </span>

                  {item.releaseDate && (
                    <span>
                      {item.releaseDate.slice(0, 4)}
                    </span>
                  )}

                  {item.rating > 0 && (
                    <span>
                      ⭐ {item.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </main>
  );
}

export default Search;