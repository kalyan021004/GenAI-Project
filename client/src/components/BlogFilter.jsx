
// =====================================================
// FILE: src/components/BlogFilter.jsx
// =====================================================

import React from "react";

const BlogFilter = ({ filters, setFilters, onApply }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md grid md:grid-cols-4 gap-4">
      <input
        type="text"
        placeholder="Location"
        value={filters.location}
        onChange={(e) =>
          setFilters({
            ...filters,
            location: e.target.value,
          })
        }
        className="border p-2 rounded-lg"
      />

      <select
        value={filters.category}
        onChange={(e) =>
          setFilters({
            ...filters,
            category: e.target.value,
          })
        }
        className="border p-2 rounded-lg"
      >
        <option value="">
          All Categories
        </option>
        <option value="Temple">
          Temple
        </option>
        <option value="Fort">
          Fort
        </option>
        <option value="Museum">
          Museum
        </option>
        <option value="Beach">
          Beach
        </option>
      </select>

      <select
        value={filters.rating}
        onChange={(e) =>
          setFilters({
            ...filters,
            rating: e.target.value,
          })
        }
        className="border p-2 rounded-lg"
      >
        <option value="">
          All Ratings
        </option>
        <option value="4">
          4+ Stars
        </option>
        <option value="3">
          3+ Stars
        </option>
      </select>

      <button
        onClick={onApply}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default BlogFilter;
