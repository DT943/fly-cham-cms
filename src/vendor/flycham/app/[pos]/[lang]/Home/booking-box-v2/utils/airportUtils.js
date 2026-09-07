/**
 * Utility functions for airport/city data handling
 */

/**
 * Gets city information from airports array by ID
 * @param {Array} cities - Array of airport objects
 * @param {string|number} id - Airport ID to find
 * @param {string} fallbackCity - Fallback city name
 * @param {string} fallbackAirport - Fallback airport name
 * @returns {Object} Object with city and airport properties
 */
export const getCityInfo = (cities, id, fallbackCity, fallbackAirport) => {
  if (!cities || !id) {
    return {
      city: fallbackCity,
      airport: fallbackAirport,
    };
  }

  const airport = cities.find((c) => c.id === id);
  const translation = airport?.airPortTranslations?.[0] || {};

  return {
    city: translation.city || fallbackCity,
    airport: translation.airPortName || fallbackAirport,
  };
};

