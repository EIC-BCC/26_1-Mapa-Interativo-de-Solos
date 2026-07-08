import { booleanValid } from "@turf/boolean-valid";
import type { GeoJsonGeometry } from "../types/geojson.types";

const VALIDATABLE_TYPES = new Set(["Polygon", "MultiPolygon"]);

export function isValidGeometry(
  geometry?: GeoJsonGeometry | null
): boolean {
  if (!geometry || !Array.isArray(geometry.coordinates)) {
    return false;
  }

  if (!VALIDATABLE_TYPES.has(geometry.type)) {
    return false;
  }

  if (hasNonFiniteCoordinate(geometry.coordinates)) {
    return false;
  }

  try {
    return booleanValid({
      type: geometry.type,
      coordinates: geometry.coordinates,
    } as GeoJSON.Polygon | GeoJSON.MultiPolygon);
  } catch {
    return false;
  }
}

function hasNonFiniteCoordinate(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(hasNonFiniteCoordinate);
  }

  return typeof value === "number" && !Number.isFinite(value);
}
