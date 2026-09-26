import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-brand">
          <h2>CINEVO</h2>

          <p>Discover your next story.</p>
        </div>


        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/series">Series</Link>
          <Link to="/my-list">My List</Link>
        </nav>


        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} CINEVO
          </p>

          <div className="footer-tmdb">
            <span>Powered by TMDB</span>

            <span>
              This product uses the TMDB API but is not endorsed or certified
              by TMDB.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;