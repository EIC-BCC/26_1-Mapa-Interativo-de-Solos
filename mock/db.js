const fs = require("fs");
const path = require("path");

const RESOURCE_NAME = "soils";

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isGeoJsonFeatureCollection(value) {
  return (
    isObject(value) &&
    value.type === "FeatureCollection" &&
    Array.isArray(value.features)
  );
}

function isJsonServerDatabase(value) {
  return (
    isObject(value) &&
    Object.prototype.hasOwnProperty.call(value, RESOURCE_NAME)
  );
}

function normalizeDatabase(data) {
  if (isJsonServerDatabase(data)) {
    return data;
  }

  if (isGeoJsonFeatureCollection(data)) {
    return {
      [RESOURCE_NAME]: data,
    };
  }

  if (Array.isArray(data)) {
    return {
      [RESOURCE_NAME]: data,
    };
  }

  return {
    [RESOURCE_NAME]: data,
  };
}

module.exports = () => {
  const mockDataFile = process.env.MOCK_DATA_FILE || "db.legacy.json";
  const dataPath = path.resolve(__dirname, mockDataFile);

  if (!fs.existsSync(dataPath)) {
    throw new Error(`Mock data file not found: ${dataPath}`);
  }

  const rawContent = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(rawContent);

  return normalizeDatabase(data);
};
