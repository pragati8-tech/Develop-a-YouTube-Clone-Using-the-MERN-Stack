import "./FilterBar.css";

// List of available video filters/categories
const FILTERS = [
  "All",
  "Trending",
  "React",
  "JavaScript",
  "Gaming",
  "Music",
  "News",
  "Sports",
  "Education",
  "Technology",
  "Cooking",
  "Travel",
];

const FilterBar = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="filter-bar">
      {/* Horizontal scroll container for filter chips */}
      <div className="filter-bar__track">
        {/* Render filter buttons dynamically */}
        {FILTERS.map((filter) => (
          <button
            key={filter}
            className={`filter-bar__chip ${
              activeFilter === filter ? "filter-bar__chip--active" : ""
            }`}
            onClick={() => onFilterChange(filter)} // Update selected filter
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
