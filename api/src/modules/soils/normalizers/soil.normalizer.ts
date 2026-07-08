import { normalizeGeoJsonFeature } from "./geojson_soil.normalizer";
import { normalizeLegacySoil } from "./legacy_soil.normalizer";
import type { NormalizedSoil } from "../types/soil.types";
import type { GeoJsonFeatureCollection } from "../types/geojson.types";
import type { LegacySoil } from "../types/legacy_soil.types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export type NormalizeSoilsResult = {
  soils: NormalizedSoil[];
  totalFeatures: number;
  discardedByInvalidGeometry: number;
};

function isGeoJsonFeatureCollection(
  value: unknown
): value is GeoJsonFeatureCollection {
  return (
    isObject(value) &&
    value.type === "FeatureCollection" &&
    Array.isArray(value.features)
  );
}

function isLegacySoil(value: unknown): value is LegacySoil {
  return (
    isObject(value) &&
    typeof value.id === "string" &&
    typeof value.key === "string" &&
    typeof value.name === "string" &&
    isObject(value.area) &&
    typeof value.area.shape === "string"
  );
}

function extractSoilPayload(rawData: unknown): unknown {
  if (Array.isArray(rawData)) return rawData;

  if (isGeoJsonFeatureCollection(rawData)) return rawData;

  if (isObject(rawData) && "soils" in rawData) {
    return rawData.soils;
  }

  return rawData;
}


export function normalizeSoils(rawData: unknown): NormalizeSoilsResult {
  const payload = extractSoilPayload(rawData);

  if (Array.isArray(payload)) {
    const soils = payload.filter(isLegacySoil).map(normalizeLegacySoil);
    return {
      soils,
      totalFeatures: payload.length,
      discardedByInvalidGeometry: 0,
    };
  }

  if (isGeoJsonFeatureCollection(payload)) {
    const normalized = payload.features.map((feature, index) =>
      normalizeGeoJsonFeature(feature, index)
    );
    const soils = normalized.filter(
      (soil): soil is NormalizedSoil => soil !== null
    );

    return {
      soils,
      totalFeatures: payload.features.length,
      discardedByInvalidGeometry: normalized.length - soils.length,
    };
  }

  return { soils: [], totalFeatures: 0, discardedByInvalidGeometry: 0 };
}
