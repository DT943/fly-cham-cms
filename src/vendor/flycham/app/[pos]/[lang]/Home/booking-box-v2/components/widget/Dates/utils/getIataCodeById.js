const getIataCodeById = ({ id, airPorts }) => {
  if (!airPorts || !Array.isArray(airPorts.items)) return '';

  // IDs may be stored as numbers or strings in different places, so compare as strings
  const targetId = String(id);
  const match = airPorts.items.find((item) => String(item.id) === targetId);

  return match?.iataCode || '';
};

export default getIataCodeById;