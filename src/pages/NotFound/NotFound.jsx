import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found">
      <div className="not-found-content">
        <span className="not-found-code">404</span>

        <p className="not-found-label">PAGE NOT FOUND</p>

        <h1>Looks like this scene doesn't exist.</h1>

        <p className="not-found-description">
          The page you're looking for may have been moved, removed,
          or never existed.
        </p>

        <Button
          variant="contained"
          startIcon={<HomeRoundedIcon />}
          onClick={() => navigate("/")}
          className="not-found-btn"
        >
          Back to Home
        </Button>
      </div>
    </main>
  );
}

export default NotFound;