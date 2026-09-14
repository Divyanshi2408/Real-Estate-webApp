// Turns "locality, city" into { latitude, longitude } using OpenStreetMap's
// free Nominatim geocoding API. No API key needed — just a descriptive
// User-Agent, which Nominatim's usage policy requires.
// Best-effort only: if it fails or finds nothing, we return null and the
// property is simply saved without coordinates (no map pin for it).
const geocodeAddress = async (locality, city) => {
  try {
    const query = encodeURIComponent(`${locality}, ${city}`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "BrickAndBeamsFinalYearProject/1.0" },
    });

    if (!response.ok) return null;

    const results = await response.json();
    if (!Array.isArray(results) || results.length === 0) return null;

    const { lat, lon } = results[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  } catch (error) {
    console.error("Geocoding failed:", error.message);
    return null;
  }
};

module.exports = geocodeAddress;
