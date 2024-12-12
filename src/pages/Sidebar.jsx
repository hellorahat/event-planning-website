import React, { useState } from "react";

function Sidebar({ filterOptions, onFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});

  const styles = {
    sidebar: {
      width: "300px",
      backgroundColor: "#f9fafc",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      fontSize: "24px",
      marginBottom: "20px",
      color: "#222",
      fontWeight: "bold",
      textAlign: "center",
      borderBottom: "2px solid #e0e0e0",
      paddingBottom: "10px",
    },
    section: {
      paddingBottom: "15px",
    },
    accordionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "18px",
      fontWeight: "500",
      cursor: "pointer",
      padding: "10px 15px",
      backgroundColor: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      color: "#333",
      transition: "background-color 0.3s ease, color 0.3s ease",
    },
    accordionHeaderHover: {
      backgroundColor: "#e3f2fd",
      color: "#1877f2",
    },
    accordionContent: {
      listStyle: "none",
      paddingLeft: "15px",
      marginTop: "10px",
    },
    filterLabel: {
      fontSize: "16px",
      color: "#333",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      padding: "5px 8px",
      transition: "background-color 0.2s, color 0.2s",
    },
    filterLabelHover: {
      backgroundColor: "#f5f5f5",
      color: "#1877f2",
    },
    applyButton: {
      marginTop: "30px",
      padding: "12px 20px",
      backgroundColor: "#1877f2",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.3s ease, transform 0.2s ease",
    },
    applyButtonHover: {
      backgroundColor: "#145dbf",
    },
  };

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
    <div style={styles.sidebar}>
      <h2 style={styles.header}>Filters</h2>
      {filterOptions.map((option) => (
        <div key={option.label} style={styles.section}>
          <div
            style={styles.accordionHeader}
            onClick={() => toggleSection(option.label)}
          >
            {option.label}
            <span>{expandedSections[option.label] ? "-" : "+"}</span>
          </div>
          {expandedSections[option.label] && (
            <ul style={styles.accordionContent}>
              {option.values.map((value) => (
                <li key={value}>
                  <label style={styles.filterLabel}>
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
      <button style={styles.applyButton} onClick={applyFilters}>
        Apply Filters
      </button>
    </div>
  );
}

export default Sidebar;
