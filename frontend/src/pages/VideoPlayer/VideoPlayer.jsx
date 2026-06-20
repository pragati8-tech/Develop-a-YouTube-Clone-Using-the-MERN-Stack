import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import CommentSection from "../../components/CommentSection/CommentSection";
import useAuth from "../../hooks/useAuth";
import { fetchVideoById, likeVideo, dislikeVideo } from "../../services/api";
import { formatViews, timeAgo } from "../../utils/formatViews";
import "./VideoPlayer.css";

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const res = await fetchVideoById(id);
        const data = res.data;
        setVideo(data);
        setLikeCount(data.likes?.length || 0);
        setDislikeCount(data.dislikes?.length || 0);

        if (user) {
          setLiked(data.likes?.includes(user._id));
          setDisliked(data.dislikes?.includes(user._id));
        }
      } catch (err) {
        setError("Could not load video. Backend might be offline.");
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return alert("Please sign in to like videos");
    try {
      const res = await likeVideo(id);
      setLikeCount(res.data.likes);
      setDislikeCount(res.data.dislikes);
      setLiked((prev) => !prev);
      if (!liked) setDisliked(false);
    } catch {
      alert("Could not like video");
    }
  };

  const handleDislike = async () => {
    if (!user) return alert("Please sign in to dislike videos");
    try {
      const res = await dislikeVideo(id);
      setLikeCount(res.data.likes);
      setDislikeCount(res.data.dislikes);
      setDisliked((prev) => !prev);
      if (!disliked) setLiked(false);
    } catch {
      alert("Could not dislike video");
    }
  };

  return (
    <div className="video-player-page">
      <Header onToggleSidebar={() => setSidebarOpen((p) => !p)} onSearch={() => {}} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`video-player-page__main ${sidebarOpen ? "video-player-page__main--shifted" : ""}`}>
        {loading ? (
          <div className="video-player-page__loading">Loading video...</div>
        ) : error || !video ? (
          <div className="video-player-page__error">
            <p>{error || "Video not found"}</p>
            <Link to="/">Go back home</Link>
          </div>
        ) : (
          <div className="video-player-page__content">

            <div className="video-player">
              <video
                src={video.videoUrl}
                controls
                autoPlay
                className="video-player__el"
                poster={video.thumbnailUrl}
              >
                Your browser does not support video playback.
              </video>
            </div>

            <h1 className="video-player__title">{video.title}</h1>

            <div className="video-player__row">
              <Link
                to={`/channel/${video.channelId?._id || video.channelId}`}
                className="video-player__channel"
              >
                <div className="video-player__avatar">
                  {(video.channelId?.channelName || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="video-player__channel-name">
                    {video.channelId?.channelName || "Unknown Channel"}
                  </p>
                </div>
              </Link>

              <div className="video-player__actions">
                <button
                  className={`video-player__action-btn ${liked ? "video-player__action-btn--active" : ""}`}
                  onClick={handleLike}
                >
                  👍 {likeCount}
                </button>
                <button
                  className={`video-player__action-btn ${disliked ? "video-player__action-btn--active" : ""}`}
                  onClick={handleDislike}
                >
                  👎 {dislikeCount}
                </button>
              </div>
            </div>

            <div className="video-player__description">
              <p className="video-player__stats">
                {formatViews(video.views)} &bull; {timeAgo(video.createdAt)}
              </p>
              <p>{video.description || "No description provided."}</p>
            </div>

            <CommentSection videoId={id} />

          </div>
        )}
      </main>
    </div>
  );
};

export default VideoPlayer;