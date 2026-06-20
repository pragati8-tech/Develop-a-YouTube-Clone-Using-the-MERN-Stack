import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import useAuth from "../../hooks/useAuth";
import {
  fetchMyChannel,
  createChannel,
  uploadVideo,
  updateVideo,
  deleteVideo,
} from "../../services/api";
import { formatViews, timeAgo } from "../../utils/formatViews";
import "./Channel.css";

const Channel = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Create channel form ──
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [channelForm, setChannelForm] = useState({ channelName: "", description: "", channelBanner: "" });

  // ── Upload / Edit video form ──
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: "", description: "", thumbnailUrl: "", videoUrl: "", category: "Education",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Load own channel ──
  useEffect(() => {
    const loadChannel = async () => {
      try {
        setLoading(true);
        const res = await fetchMyChannel();
        setChannel(res.data);
      } catch {
        setChannel(null); // no channel yet — create form dikhega
      } finally {
        setLoading(false);
      }
    };
    loadChannel();
  }, []);

  // ── Create channel ──
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!channelForm.channelName.trim()) {
      setFormError("Channel name is required");
      return;
    }
    try {
      setSubmitting(true);
      const res = await createChannel(channelForm);
      setChannel(res.data);
      setShowCreateForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not create channel");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Open form for new video ──
  const openAddVideoForm = () => {
    setEditingVideoId(null);
    setVideoForm({ title: "", description: "", thumbnailUrl: "", videoUrl: "", category: "Education" });
    setShowVideoForm(true);
  };

  // ── Open form for editing existing video ──
  const openEditVideoForm = (video) => {
    setEditingVideoId(video._id);
    setVideoForm({
      title: video.title,
      description: video.description || "",
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      category: video.category,
    });
    setShowVideoForm(true);
  };

  // ── Submit video (create or update) ──
  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const { title, thumbnailUrl, videoUrl, category } = videoForm;
    if (!title.trim() || !thumbnailUrl.trim() || !videoUrl.trim() || !category) {
      setFormError("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      if (editingVideoId) {
        const res = await updateVideo(editingVideoId, videoForm);
        setChannel((prev) => ({
          ...prev,
          videos: prev.videos.map((v) => (v._id === editingVideoId ? res.data : v)),
        }));
      } else {
        const res = await uploadVideo({ ...videoForm, channelId: channel._id });
        setChannel((prev) => ({ ...prev, videos: [res.data, ...prev.videos] }));
      }
      setShowVideoForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save video");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete video ──
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video permanently?")) return;
    try {
      await deleteVideo(videoId);
      setChannel((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch {
      alert("Could not delete video");
    }
  };

  const isOwner = channel && user && channel.owner?._id === user._id;

  return (
    <div className="channel-page">
      <Header onToggleSidebar={() => setSidebarOpen((p) => !p)} onSearch={() => {}} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`channel-page__main ${sidebarOpen ? "channel-page__main--shifted" : ""}`}>
        {loading ? (
          <div className="channel-page__loading">Loading...</div>

        ) : !channel ? (
          /* ── No channel yet ── */
          <div className="channel-page__empty">
            <h2>You don't have a channel yet</h2>
            <p>Create one to start uploading videos.</p>
            <button className="channel-page__create-btn" onClick={() => setShowCreateForm(true)}>
              + Create Channel
            </button>

            {showCreateForm && (
              <form className="channel-form" onSubmit={handleCreateChannel}>
                {formError && <p className="channel-form__error">{formError}</p>}
                <input
                  type="text"
                  placeholder="Channel name"
                  value={channelForm.channelName}
                  onChange={(e) => setChannelForm({ ...channelForm, channelName: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  value={channelForm.description}
                  onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Banner image URL (optional)"
                  value={channelForm.channelBanner}
                  onChange={(e) => setChannelForm({ ...channelForm, channelBanner: e.target.value })}
                />
                <button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create"}
                </button>
              </form>
            )}
          </div>

        ) : (
          /* ── Channel exists ── */
          <>
            {/* Banner */}
            <div
              className="channel-banner"
              style={{ backgroundImage: `url(${channel.channelBanner || "https://placehold.co/1200x200/1a1a1a/333?text="})` }}
            />

            {/* Info row */}
            <div className="channel-info">
              <div className="channel-info__avatar">
                {channel.channelName.charAt(0).toUpperCase()}
              </div>
              <div className="channel-info__text">
                <h1>{channel.channelName}</h1>
                <p>{channel.subscribers} subscribers &bull; {channel.videos?.length || 0} videos</p>
                <p className="channel-info__desc">{channel.description}</p>
              </div>

              {isOwner && (
                <button className="channel-page__create-btn" onClick={openAddVideoForm}>
                  + Upload Video
                </button>
              )}
            </div>

            {/* Video form (add / edit) */}
            {showVideoForm && (
              <form className="channel-form channel-form--video" onSubmit={handleVideoSubmit}>
                <h3>{editingVideoId ? "Edit Video" : "Upload New Video"}</h3>
                {formError && <p className="channel-form__error">{formError}</p>}

                <input
                  type="text" placeholder="Title"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                />
                <input
                  type="text" placeholder="Thumbnail URL"
                  value={videoForm.thumbnailUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                />
                <input
                  type="text" placeholder="Video URL"
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                />
                <select
                  value={videoForm.category}
                  onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                >
                  {["Education","React","JavaScript","Gaming","Music","News","Sports","Technology","Cooking","Travel","Trending"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <div className="channel-form__actions">
                  <button type="button" onClick={() => setShowVideoForm(false)}>Cancel</button>
                  <button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : editingVideoId ? "Update" : "Upload"}
                  </button>
                </div>
              </form>
            )}

            {/* Video grid */}
            <div className="channel-videos">
              {channel.videos?.length === 0 ? (
                <p className="channel-page__no-videos">No videos uploaded yet.</p>
              ) : (
                <div className="channel-videos__grid">
                  {channel.videos.map((video) => (
                    <div key={video._id} className="channel-video-card">
                      <img src={video.thumbnailUrl} alt={video.title} className="channel-video-card__thumb" />
                      <div className="channel-video-card__info">
                        <h4>{video.title}</h4>
                        <p>{formatViews(video.views)} &bull; {timeAgo(video.createdAt)}</p>
                      </div>
                      {isOwner && (
                        <div className="channel-video-card__actions">
                          <button onClick={() => openEditVideoForm(video)}>Edit</button>
                          <button onClick={() => handleDeleteVideo(video._id)} className="channel-video-card__delete">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Channel;