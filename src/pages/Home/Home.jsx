import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import FilterBar from "../../components/FilterBar/FilterBar";
import VideoCard from "../../components/VideoCard/VideoCard";
import { fetchVideos } from "../../services/api";
import "./Home.css";

// Fallback video data when backend is unavailable
const SAMPLE_VIDEOS = [
  // sample videos...
];

const Home = () => {
  // UI state management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Video data state
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();

  // Sync filter state with URL query parameter
  useEffect(() => {
    const f = searchParams.get("filter");
    if (f) setActiveFilter(f);
  }, [searchParams]);

  // Fetch videos from API and fallback to sample data if API fails
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await fetchVideos();
        const data = res.data?.videos || res.data || [];

        setVideos(data.length ? data : SAMPLE_VIDEOS);
      } catch {
        setVideos(SAMPLE_VIDEOS);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Filter and search videos efficiently
  const displayed = useMemo(() => {
    return videos.filter((v) => {
      const matchFilter =
        activeFilter === "All" ||
        (v.category && v.category.toLowerCase() === activeFilter.toLowerCase());

      const matchSearch =
        !searchQuery ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [videos, activeFilter, searchQuery]);

  return (
    <div className="home">
      {/* Header component */}
      <Header
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        onSearch={setSearchQuery}
      />

      {/* Sidebar component */}
      <Sidebar isOpen={sidebarOpen} />

      <main
        className={`home__main ${sidebarOpen ? "home__main--shifted" : ""}`}
      >
        {/* Category filter bar */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="home__content">
          {/* Loading skeleton UI */}
          {loading ? (
            <div className="home__grid">{/* Skeleton cards */}</div>
          ) : displayed.length === 0 ? (
            /* Empty state when no videos match */
            <div className="home__empty">
              <span>🔍</span>
              <h3>No videos found</h3>
              <p>Try a different search or filter</p>
            </div>
          ) : (
            /* Render filtered videos */
            <div className="home__grid">
              {displayed.map((video) => (
                <VideoCard key={video._id || video.videoId} video={video} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
