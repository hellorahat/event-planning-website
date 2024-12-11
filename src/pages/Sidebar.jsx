import React, { useState } from "react";

function Sidebar({ filterOptions, onFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({}); // State to manage expanded sections
  const [selectedFilters, setSelectedFilters] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterSelect = (filterKey, value) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      if (updatedFilters[filterKey]?.includes(value)) {
        updatedFilters[filterKey] = updatedFilters[filterKey].filter(
          (v) => v !== value
        );
      } else {
        updatedFilters[filterKey] = [...(updatedFilters[filterKey] || []), value];
      }
      return updatedFilters;
    });
  };

  const applyFilters = () => {
    onFilterChange(selectedFilters);
  };

  return (
    <div className="sidebar">
      <h2>Filters</h2>
      {filterOptions.map((option) => (
        <div key={option.label} className="accordion-section">
          <div
            className="accordion-header"
            onClick={() => toggleSection(option.label)}
          >
            {option.label}
            <span className="accordion-icon">
              {expandedSections[option.label] ? "-" : "+"}
            </span>
          </div>
          {expandedSections[option.label] && (
            <ul className="accordion-content">
              {option.values.map((value) => (
                <li key={value}>
                  <label className="filter-label">
                    <input
                      type="checkbox"
                      checked={
                        selectedFilters[option.filterKey]?.includes(value) || false
                      }
                      onChange={() => handleFilterSelect(option.filterKey, value)}
                    />
                    {value}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <button className="apply-filters-btn" onClick={applyFilters}>
        Apply Filters
      </button>
    </div>
  );
}

export default Sidebar;