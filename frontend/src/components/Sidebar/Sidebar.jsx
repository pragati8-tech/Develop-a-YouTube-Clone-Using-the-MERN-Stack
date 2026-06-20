import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Sidebar.css";

// Sidebar navigation items list
const navItems = [
  { icon: "🏠", label: "Home", path: "/" },
  { icon: "🔥", label: "Trending", path: "/?filter=Trending" },
  { icon: "🎮", label: "Gaming", path: "/?filter=Gaming" },
  { icon: "🎵", label: "Music", path: "/?filter=Music" },
  { icon: "📰", label: "News", path: "/?filter=News" },
  { icon: "⚽", label: "Sports", path: "/?filter=Sports" },
  { icon: "🎓", label: "Education", path: "/?filter=Education" },
  { icon: "💻", label: "Technology", path: "/?filter=Technology" },
  { icon: "🍳", label: "Cooking", path: "/?filter=Cooking" },
  { icon: "✈️", label: "Travel", path: "/?filter=Travel" },
];

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay shown when sidebar is open (for mobile view) */}
      {isOpen && <div className="sidebar__overlay" />}

      {/* Sidebar container with open/close state */}
      <aside
        className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--closed"}`}
      >
        <nav className="sidebar__nav">
          {/* Render navigation links dynamically */}
          {navItems.map((item) => (
            <Link key={item.label} to={item.path} className="sidebar__item">
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__label">{item.label}</span>
            </Link>
          ))}

          {/* Divider line */}
          <div className="sidebar__divider" />

          {/* User-specific section */}
          {user ? (
            // Show channel link if user is logged in
            <Link
              to={`/channel/${user.channelId || "my"}`}
              className="sidebar__item"
            >
              <span className="sidebar__icon">📺</span>
              <span className="sidebar__label">Your Channel</span>
            </Link>
          ) : (
            // Show sign-in prompt if user is not logged in
            <div className="sidebar__signin-prompt">
              <p>Sign in to access your channel</p>

              {/* Navigate to login page */}
              <button
                className="sidebar__signin-btn"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
