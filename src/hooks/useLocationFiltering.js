import { useMemo, useState } from "react";
import { filterLocations } from "../utils/locationHelpers";

export function useLocationFiltering(searchTerm, limit = 12) {
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredLocations = useMemo(() => {
    if (searchTerm.trim() === "") {
      return [];
    }
    return filterLocations(searchTerm, limit);
  }, [limit, searchTerm]);

  return { filteredLocations, showDropdown, setShowDropdown };
}
