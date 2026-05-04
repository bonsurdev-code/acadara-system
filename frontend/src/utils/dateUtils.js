/**
 * Formats a Date range into a PostgreSQL DATERANGE string: [YYYY-MM-DD, YYYY-MM-DD]
 */
export const formatToPostgresRange = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];
  return `[${start}, ${end}]`;
};

/**
 * Parses the PostgreSQL JSON response back into JS Date objects
 */
export const parsePostgresRange = (availability) => {
  if (!availability || !Array.isArray(availability) || availability.length < 2) {
    return { start: null, end: null };
  }
  return {
    start: new Date(availability[0].value),
    end: new Date(availability[1].value)
  };
};