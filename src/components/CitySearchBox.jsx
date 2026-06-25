import { Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { useLocationFiltering } from "../hooks/useLocationFiltering";
import { findLocationByValue } from "../utils/locationHelpers";

function getOptionId(id, index) {
  return `${id}-option-${index}`;
}

export default function CitySearchBox({ id = "city-search" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const { filteredLocations, showDropdown, setShowDropdown } =
    useLocationFiltering(searchTerm, 12);
  const hasQuery = searchTerm.trim().length > 0;
  const shouldShowDropdown = showDropdown && hasQuery;

  const activeOptionId =
    activeIndex >= 0 && shouldShowDropdown ? getOptionId(id, activeIndex) : undefined;

  const selectedFromInput = useMemo(() => {
    if (!searchTerm) return null;
    const match = findLocationByValue(searchTerm);
    return match ? match[1] : null;
  }, [searchTerm]);

  useClickOutside(dropdownRef, () => {
    setShowDropdown(false);
    setActiveIndex(-1);
  });

  const chooseLocation = (locationName, locationData) => {
    setSearchTerm(locationData.locationNameFull || locationName);
    setSelectedLocation(locationData);
    setShowDropdown(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const clearSelection = () => {
    setSearchTerm("");
    setSelectedLocation(null);
    setShowDropdown(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (event) => {
    const nextValue = event.target.value;
    setSearchTerm(nextValue);
    setSelectedLocation(null);
    setActiveIndex(-1);
    setShowDropdown(nextValue.trim().length > 0);
  };

  const handleInputFocus = () => {
    if (searchTerm.trim() && !selectedLocation) {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (event) => {
    if (!shouldShowDropdown && event.key === "ArrowDown" && filteredLocations.length) {
      setShowDropdown(true);
      setActiveIndex(0);
      event.preventDefault();
      return;
    }

    if (!shouldShowDropdown) return;

    if (event.key === "ArrowDown") {
      setActiveIndex((current) =>
        current >= filteredLocations.length - 1 ? 0 : current + 1,
      );
      event.preventDefault();
    }

    if (event.key === "ArrowUp") {
      setActiveIndex((current) =>
        current <= 0 ? filteredLocations.length - 1 : current - 1,
      );
      event.preventDefault();
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      const [locationName, locationData] = filteredLocations[activeIndex];
      chooseLocation(locationName, locationData);
      event.preventDefault();
    }

    if (event.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
      event.preventDefault();
    }
  };

  const resolvedSelection = selectedLocation || selectedFromInput;

  return (
    <div className="search-shell" ref={dropdownRef}>
      <label className="sr-only" htmlFor={id}>
        Search cities
      </label>
      <div className="search-input-wrap">
        <Search className="search-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={shouldShowDropdown}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={activeOptionId}
          autoComplete="off"
          spellCheck="false"
          placeholder="Search for a city"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
        />
        {hasQuery ? (
          <button
            className="clear-button"
            type="button"
            aria-label="Clear city search"
            onClick={clearSelection}
          >
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {shouldShowDropdown ? (
        <div className="suggestions" role="presentation">
          <div className="suggestions-header">
            {filteredLocations.length
              ? `${filteredLocations.length} city suggestions`
              : "No city suggestions"}
          </div>
          <div id={`${id}-listbox`} role="listbox" aria-label="City suggestions">
            {filteredLocations.map(([locationName, locationData], index) => (
              <button
                id={getOptionId(id, index)}
                key={locationData.location_id}
                type="button"
                role="option"
                aria-selected={activeIndex === index}
                className={
                  activeIndex === index ? "suggestion active" : "suggestion"
                }
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => chooseLocation(locationName, locationData)}
              >
                <span className="suggestion-main">
                  {locationData.locationName}
                </span>
                <span className="suggestion-detail">
                  {locationData.locationNameFull}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {resolvedSelection ? (
        <div className="selected-city" aria-live="polite">
          Selected: {resolvedSelection.locationNameFull}
        </div>
      ) : null}
    </div>
  );
}
