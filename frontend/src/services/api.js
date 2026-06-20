import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser  = (data) => API.post("/auth/register", data);
export const loginUser     = (data) => API.post("/auth/login", data);

// ── Videos ───────────────────────────────────────────────────────────────────
export const fetchVideos        = (params) => API.get("/videos", { params });
export const fetchVideoById     = (id)     => API.get(`/videos/${id}`);
export const uploadVideo        = (data)   => API.post("/videos", data);
export const updateVideo        = (id, data) => API.put(`/videos/${id}`, data);
export const deleteVideo        = (id)     => API.delete(`/videos/${id}`);
export const likeVideo          = (id)     => API.put(`/videos/${id}/like`);
export const dislikeVideo       = (id)     => API.put(`/videos/${id}/dislike`);

// ── Channels ──────────────────────────────────────────────────────────────────
export const createChannel      = (data)   => API.post("/channels", data);
export const fetchChannelById   = (id)     => API.get(`/channels/${id}`);
export const fetchMyChannel     = ()       => API.get("/channels/my");

// ── Comments ──────────────────────────────────────────────────────────────────
export const fetchComments      = (videoId)        => API.get(`/comments/${videoId}`);
export const addComment         = (videoId, data)  => API.post(`/comments/${videoId}`, data);
export const updateComment      = (id, data)       => API.put(`/comments/${id}`, data);
export const deleteComment      = (id)             => API.delete(`/comments/${id}`);

export default API;
