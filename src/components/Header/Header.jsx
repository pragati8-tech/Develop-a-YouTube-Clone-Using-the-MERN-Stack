import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Header.css";

const Header = ({ onToggleSidebar, onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");

  // Dropdown menu open/close state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Handle user logout action
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="header">
      {/* LEFT SECTION: Sidebar toggle + Logo */}
      <div className="header__left">
        <button
          className="header__hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/" className="header__logo">
          {/* App logo */}
          <svg
            viewBox="0 0 90 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="header__logo-svg"
          >
            <path
              d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.285 0 14.285 0C14.285 0 5.35042 0 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"
              fill="#FF0000"
            />
            <path
              d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z"
              fill="white"
            />
          </svg>
          <span className="header__logo-text">YouTube</span>
        </Link>
      </div>

      {/* CENTER SECTION: Search bar */}
      <form className="header__search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch(e.target.value); // live search
          }}
          className="header__search-input"
        />
        <button
          type="submit"
          className="header__search-btn"
          aria-label="Search"
        >
          {/* Search icon */}
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20.87 20.17l-5.59-5.59A7.92 7.92 0 0 0 17 11c0-4.41-3.59-8-8-8s-8 3.59-8 8 3.59 8 8 8c1.95 0 3.73-.71 5.12-1.88l5.59 5.59.16-.54zM9 17c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
          </svg>
        </button>
      </form>

      {/* RIGHT SECTION: User login/profile */}
      <div className="header__right">
        {/* If user is logged in show profile */}
        {user ? (
          <div
            className="header__user"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {/* User avatar (first letter of username) */}
            <div className="header__avatar">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <span className="header__username">{user.username}</span>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="header__dropdown">
                {/* Go to user channel */}
                <Link
                  to={`/channel/${user.channelId || "my"}`}
                  className="header__dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  {/* Channel icon */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="18"
                    height="18"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                  Your Channel
                </Link>

                {/* Logout button */}
                <button
                  className="header__dropdown-item header__dropdown-logout"
                  onClick={handleLogout}
                >
                  {/* Logout icon */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="18"
                    height="18"
                  >
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          // If user is not logged in show Sign In button
          <Link to="/login" className="header__signin-btn">
            {/* User icon */}
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
