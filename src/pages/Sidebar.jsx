import { useState } from "react";
import "../styles/SideBar.css";

function FilterSidebar({ onFilterChange, filterOptions }) {
  const [openSection, setOpenSection] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleFilterClick = (event, filterType, value) => {
    // Prevent the click event from bubbling up to the button
    event.stopPropagation();

    const currentFilters = selectedFilters[filterType] || [];
    const updatedFilters = currentFilters.includes(value)
      ? currentFilters.filter((item) => item !== value)
      : [...currentFilters, value];

    const updatedSelectedFilters = {
      ...selectedFilters,
      [filterType]: updatedFilters,
    };

    setSelectedFilters(updatedSelectedFilters);
    onFilterChange(updatedSelectedFilters);
  };

  return (
    <div className="sidebar">
      <ul>
        {filterOptions.map((option, index) => (
          <li key={index}>
            <button onClick={() => toggleSection(index)}>
              {option.label}{" "}
              <span
                className={`arrow ${openSection === index ? "up" : "down"}`}
              ></span>
            </button>
            <div
              className={`dropdown ${openSection === index ? "active" : ""}`}
            >
              {option.values.map((value) => (
                <p
                  key={value}
                  onClick={(event) =>
                    handleFilterClick(event, option.filterKey, value)
                  }
                  className={
                    (selectedFilters[option.filterKey] || []).includes(value)
                      ? "selected"
                      : ""
                  }
                >
                  <span
                    className={`bubble ${
                      (selectedFilters[option.filterKey] || []).includes(value)
                        ? "selected"
                        : ""
                    }`}
                  ></span>
                  {value}
                </p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FilterSidebar;
