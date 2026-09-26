import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import MyListContext from "../../context/MyListContext/MyListContext";
import Button from "@mui/material/Button";
import ExploreIcon from "@mui/icons-material/Explore";
import "./My-list.css";

function Mylist() {
  const {
    myList,
    removeFromMyList,
    clearMyList,
  } = useContext(MyListContext);

  const navigate = useNavigate();

  return (
    <main className="my-list-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="my-list-header">
        <div>
          <h1>My List</h1>
          <p>Your saved movies and series</p>
        </div>

        {myList.length > 0 && (
          <div className="my-list-header-actions">
            <span className="my-list-count">
              {myList.length}{" "}
              {myList.length === 1 ? "title" : "titles"}
            </span>

            <button
              className="my-list-clear-btn"
              onClick={clearMyList}
            >
              <CloseIcon />
              Clear All
            </button>
          </div>
        )}
      </div>


      {/* =========================
          EMPTY STATE
      ========================= */}

      {myList.length === 0 ? (
        <div className="my-list-empty">
          <div className="my-list-empty-icon">
            +
          </div>

          <h2>Your list is empty</h2>

          <p>
            Add movies and series to your list and they
            will appear here.
          </p>
          <Button
            variant="contained"
            startIcon={<ExploreIcon />}
            onClick={() => navigate("/movies")}
            className="my-list-browse-btn"
          >
            Browse Movies
          </Button>
        </div>
      ) : (

        /* =========================
           LIST
        ========================= */

        <div className="my-list-grid">
          {myList.map((item) => (
            <article
              className="my-list-card"
              key={`${item.mediaType}-${item.id}`}
              onClick={() =>
                navigate(
                  item.mediaType === "movie"
                    ? `/movies/${item.id}`
                    : `/series/${item.id}`
                )
              }
            >

              {/* =========================
                  POSTER
              ========================= */}

              <div className="my-list-poster">
                {item.poster ? (
                  <img
                    src={item.poster}
                    alt={item.title}
                  />
                ) : (
                  <div className="my-list-poster-placeholder">
                    No Image
                  </div>
                )}

                <div className="my-list-card-overlay">
                  <button
                    className="my-list-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      removeFromMyList(
                        item.id,
                        item.mediaType
                      );
                    }}
                    aria-label={`Remove ${item.title} from My List`}
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>


              {/* =========================
                  INFO
              ========================= */}

              <div className="my-list-card-info">
                <h2>{item.title}</h2>

                <div className="my-list-card-meta">
                  {item.releaseDate && (
                    <span>
                      {item.releaseDate.slice(0, 4)}
                    </span>
                  )}

                  {item.rating !== null &&
                    item.rating !== undefined && (
                      <span className="my-list-rating">
                        <StarIcon />
                        {item.rating.toFixed(1)}
                      </span>
                    )}

                  <span className="my-list-type">
                    {item.mediaType === "movie"
                      ? "Movie"
                      : "Series"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Mylist;