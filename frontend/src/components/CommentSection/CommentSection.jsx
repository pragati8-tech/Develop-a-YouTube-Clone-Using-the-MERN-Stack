import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { fetchComments, addComment, updateComment, deleteComment } from "../../services/api";
import { timeAgo } from "../../utils/formatViews";
import "./CommentSection.css";

const CommentSection = ({ videoId }) => {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const res = await fetchComments(videoId);
        setComments(res.data || []);
      } catch {
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setPosting(true);
      const res = await addComment(videoId, { text: newComment });
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch {
      alert("Could not post comment. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await updateComment(commentId, { text: editText });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data : c))
      );
      cancelEdit();
    } catch {
      alert("Could not update comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      alert("Could not delete comment.");
    }
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section__heading">{comments.length} Comments</h3>

      {user ? (
        <form className="comment-form" onSubmit={handleAddComment}>
          <div className="comment-form__avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-form__input"
          />
          <button
            type="submit"
            className="comment-form__submit"
            disabled={posting || !newComment.trim()}
          >
            {posting ? "Posting..." : "Comment"}
          </button>
        </form>
      ) : (
        <p className="comment-section__signin-msg">Sign in to add a comment.</p>
      )}

      {loading ? (
        <p className="comment-section__loading">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="comment-section__empty">No comments yet. Be the first!</p>
      ) : (
        <div className="comment-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-item__avatar">
                {(comment.userId?.username || "U").charAt(0).toUpperCase()}
              </div>

              <div className="comment-item__body">
                <p className="comment-item__meta">
                  <span className="comment-item__username">
                    {comment.userId?.username || "Unknown User"}
                  </span>
                  <span className="comment-item__time">{timeAgo(comment.createdAt)}</span>
                </p>

                {editingId === comment._id ? (
                  <div className="comment-item__edit-box">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="comment-item__edit-input"
                    />
                    <div className="comment-item__edit-actions">
                      <button onClick={cancelEdit} className="comment-item__btn">Cancel</button>
                      <button onClick={() => handleUpdateComment(comment._id)} className="comment-item__btn comment-item__btn--primary">
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="comment-item__text">{comment.text}</p>

                    {user && user._id === comment.userId?._id && (
                      <div className="comment-item__actions">
                        <button onClick={() => startEdit(comment)} className="comment-item__action">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteComment(comment._id)} className="comment-item__action comment-item__action--delete">
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;