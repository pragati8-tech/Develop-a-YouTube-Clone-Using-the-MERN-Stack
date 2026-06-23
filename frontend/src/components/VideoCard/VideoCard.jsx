import { Link, useNavigate } from "react-router-dom";
import { formatViews, timeAgo } from "../../utils/formatViews";
import "./VideoCard.css";

const VideoCard = ({ video }) => {
  const navigate = useNavigate()
  // Destructure video properties
  const {
    _id,
    videoId,
    title,
    thumbnailUrl,
    views,
    uploadDate,
     createdAt,
    channelId,
    uploader,
  } = video;

  // Use available video ID
  const id = _id || videoId;

  // channelId aur uploader populated objects hain backend se
  const channelName = channelId?.channelName;
  const uploaderName = uploader?.username;

  return (
    // Navigate to video player page
    <div className="video-card" onClick={() => navigate(`/video/${id}`)}>
      {/* Video thumbnail */}
      <div className="video-card__thumb-wrap">
        <img
          src={
            thumbnailUrl ||
            "https://placehold.co/320x180/1a1a1a/aaa?text=No+Thumbnail"
          }
          alt={title}
          className="video-card__thumb"
          // Show fallback image if thumbnail fails to load
          onError={(e) => {
            e.target.src =
              "https://placehold.co/320x180/1a1a1a/aaa?text=No+Thumbnail";
          }}
        />

        {/* Video duration badge */}
        <span className="video-card__duration">4:32</span>
      </div>

      {/* Video information */}
      <div className="video-card__info">
        {/* Channel avatar (first letter) */}
        <div className="video-card__avatar">
          {(channelName || uploaderName || "U").charAt(0).toUpperCase()}
        </div>

        <div className="video-card__meta">
          {/* Video title */}
          <h3 className="video-card__title">{title}</h3>

          {/* Channel link */}
          <Link
            to={channelId?._id ? `/channel/${channelId._id}` : "#"}
            className="video-card__channel"
            // Prevent parent Link navigation
            onClick={(e) => e.stopPropagation()}
          >
            {channelName || uploaderName || "Unknown Channel"}
          </Link>

          {/* Views and upload time */}
          <p className="video-card__stats">
            {formatViews(views)} &bull; {timeAgo(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};


export default VideoCard;
