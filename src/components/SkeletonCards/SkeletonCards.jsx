import Skeleton from "@mui/material/Skeleton";
import "./SkeletonCards.css";

function SkeletonCards() {
  return (
    <div className="movie-card-skeleton">
      <Skeleton
        variant="rounded"
        className="movie-card-skeleton-poster"
      />

      <Skeleton
        variant="text"
        width="85%"
        height={24}
      />

      <Skeleton
        variant="text"
        width="45%"
        height={18}
      />
    </div>
  );
}

export default SkeletonCards;