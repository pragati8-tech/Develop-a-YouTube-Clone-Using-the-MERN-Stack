// Format view count into K/M format
export const formatViews = (views) => {
    if (!views && views !== 0) return "0 views";

    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;

    return `${views} views`;
};

// Convert date into relative time (e.g., "2 months ago")
export const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();

    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
};