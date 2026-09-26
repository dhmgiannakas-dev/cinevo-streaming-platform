import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Sidebar.css"


/* function for active sidebar link */
function navLinkClass({ isActive }) {
    return isActive ? "nav-active" : "";
}

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="logo">
                <Link to="/">
                    <img src={logo} alt="Cinevo" />
                    </Link>
                </div>

            <nav className="sidebar-nav">
                <NavLink to="/" end className={navLinkClass}>
                    <HomeOutlinedIcon />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/search" className={navLinkClass}>
                    <SearchIcon />
                    <span>Search</span>
                </NavLink>
                <NavLink to="/movies" className={navLinkClass}>
                    <MovieOutlinedIcon />
                    <span>Movies</span>
                </NavLink>
                <NavLink to="/series" className={navLinkClass}>
                    <TvOutlinedIcon />
                    <span>Series</span>
                </NavLink>
                <NavLink to="/my-list" className={navLinkClass}>
                    <BookmarkBorderOutlinedIcon />
                    <span>My list</span>
                </NavLink>
            </nav>
            <div className="sidebar-bottom">
                <NavLink to="/settings" className={navLinkClass}>
                    <SettingsOutlinedIcon />
                    <span>Settings</span>
                </NavLink>
            </div>
        </aside>
    );
}

export default Sidebar;