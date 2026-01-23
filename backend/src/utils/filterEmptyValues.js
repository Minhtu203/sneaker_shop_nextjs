export const filterEmptyValues = (data) => {
  const filteredData = {};
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      if (typeof data[key] === Number && data[key] === 0) {
        filteredData[key] = data[key];
      } else {
        filteredData[key] = data[key];
      }
    }
  }
  return filteredData;
};
