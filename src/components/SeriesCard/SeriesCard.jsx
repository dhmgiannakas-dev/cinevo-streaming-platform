import { Link } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import "./SeriesCard.css";

function SeriesCard({ tv }) {
  return (
    <article className="tv-card">
      <Link to={`/series/${tv.id}`}>
      <div className="tv-card-image">
        {tv.poster ? <img src={tv.poster} alt={tv.title} /> : <div className="tv-card-no-poster">
            <MovieOutlinedIcon />
            <span>No image available</span>
          </div>}

        <div className="tv-card-overlay">
          <h3>{tv.title}</h3>

          <div className="tv-card-meta">
            <span>{tv.releaseDate?.slice(0, 4)}</span>
            <span>
              <StarIcon />
              {tv.rating.toFixed(1)}
            </span>
          </div>

          <p>{tv.overview}</p>
        </div>
      </div>
      </Link>
    </article>
  );
}

export default SeriesCard;