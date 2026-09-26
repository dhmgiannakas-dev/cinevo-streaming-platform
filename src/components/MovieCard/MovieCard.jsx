import { Link } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import "./MovieCard.css";

function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <Link to={`/movies/${movie.id}`}>
        <div className="movie-card-image">
          {movie.poster ? <img src={movie.poster} alt={movie.title} /> : <div className="movie-card-no-poster">
            <MovieOutlinedIcon />
            <span>No image available</span>
          </div>}

          <div className="movie-card-overlay">
            <h3>{movie.title}</h3>

            <div className="movie-card-meta">
              <span>{movie.releaseDate?.slice(0, 4)}</span>
              <span>
                <StarIcon />
                {movie.rating.toFixed(1)}
              </span>
            </div>

            <p>{movie.overview}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default MovieCard;