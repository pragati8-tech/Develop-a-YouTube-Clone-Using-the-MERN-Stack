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
  { _id:"v1", title:"Learn React in 30 Minutes", thumbnailUrl:"https://picsum.photos/seed/react/640/360", channelName:"Code with John", views:15200, uploadDate:"2024-09-20", category:"React" },
  { _id:"v2", title:"JavaScript ES2024 Features Explained", thumbnailUrl:"https://picsum.photos/seed/js/640/360", channelName:"JS Masters", views:8700, uploadDate:"2024-10-01", category:"JavaScript" },
  { _id:"v3", title:"Top 10 Games of 2024", thumbnailUrl:"https://picsum.photos/seed/game/640/360", channelName:"GamerPro", views:231000, uploadDate:"2024-08-15", category:"Gaming" },
  { _id:"v4", title:"Chill Lo-fi Beats – Study Mix", thumbnailUrl:"https://picsum.photos/seed/music/640/360", channelName:"LoFi Hub", views:540000, uploadDate:"2024-07-10", category:"Music" },
  { _id:"v5", title:"Breaking News: Tech Giants Summit 2024", thumbnailUrl:"https://picsum.photos/seed/news/640/360", channelName:"NewsNow", views:92000, uploadDate:"2024-11-01", category:"News" },
  { _id:"v6", title:"Premier League Highlights – Matchday 12", thumbnailUrl:"https://picsum.photos/seed/sports/640/360", channelName:"SportsCentral", views:187000, uploadDate:"2024-10-22", category:"Sports" },
  { _id:"v7", title:"Full Node.js Crash Course 2024", thumbnailUrl:"https://picsum.photos/seed/node/640/360", channelName:"DevAcademy", views:45300, uploadDate:"2024-09-05", category:"Education" },
  { _id:"v8", title:"AI Tools Every Developer Must Know", thumbnailUrl:"https://picsum.photos/seed/ai/640/360", channelName:"TechTalks", views:76000, uploadDate:"2024-10-18", category:"Technology" },
  { _id:"v9", title:"30-Minute Biryani Recipe at Home", thumbnailUrl:"https://picsum.photos/seed/cook/640/360", channelName:"Spice Kitchen", views:32400, uploadDate:"2024-09-28", category:"Cooking" },
  { _id:"v10", title:"Hidden Gems of Rajasthan – Travel Vlog", thumbnailUrl:"https://picsum.photos/seed/travel/640/360", channelName:"WanderIndia", views:61000, uploadDate:"2024-08-30", category:"Travel" },
  { _id:"v11", title:"Trending Reels Compilation – October 2024", thumbnailUrl:"https://picsum.photos/seed/trend/640/360", channelName:"ViralZone", views:410000, uploadDate:"2024-10-31", category:"Trending" },
  { _id:"v12", title:"MongoDB Full Tutorial for Beginners", thumbnailUrl:"https://picsum.photos/seed/mongo/640/360", channelName:"Code with John", views:28900, uploadDate:"2024-10-05", category:"Education" },
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
