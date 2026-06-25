import locationsData from "../locations.json";

export const findLocationByValue = (value) => {
  return Object.entries(locationsData).find(
    ([name, data]) =>
      name === value ||
      data.locationName === value ||
      data.locationNameFull === value,
  );
};

export const filterLocations = (searchTerm, limit = 25) => {
  if (!searchTerm.trim()) return [];
  const searchLower = searchTerm.toLowerCase();

  return Object.entries(locationsData)
    .filter(([locationName, locationData]) => {
      const locationNameLower = locationName.toLowerCase();
      const locationNameFullLower = locationData.locationNameFull.toLowerCase();
      const locationNameShortLower = locationData.locationName.toLowerCase();

      return (
        locationNameLower.includes(searchLower) ||
        locationNameFullLower.includes(searchLower) ||
        locationNameShortLower.includes(searchLower)
      );
    })
    .map((entry, index) => ({ entry, index, score: getLocationScore(entry, searchLower) }))
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map(({ entry }) => entry)
    .slice(0, limit);
};

export const locationCount = Object.keys(locationsData).length;

function getLocationScore([locationName, locationData], searchLower) {
  const values = [
    locationName,
    locationData.locationName,
    locationData.locationNameFull,
  ].map((value) => value.toLowerCase());

  if (values.some((value) => value.startsWith(searchLower))) return 0;
  if (values.some((value) => value.split(/[\s,-]+/).some((part) => part.startsWith(searchLower)))) {
    return 1;
  }
  return 2;
}
