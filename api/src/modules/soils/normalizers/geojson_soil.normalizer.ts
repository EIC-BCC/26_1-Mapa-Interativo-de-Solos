import type { GeoJsonFeature, GeoJsonGeometry } from "../types/geojson.types";
import type { NormalizedSoil } from "../types/soil.types";
import { isValidGeometry } from "../validators/geometry.validator";

function normalizeText(value?: string | null): string {
  return value?.trim().toLowerCase() ?? "";
}

function getStringProperty(
  properties: Record<string, unknown> | undefined,
  key: string
): string | null {
  const value = properties?.[key];
  return typeof value === "string" ? value : null;
}

function getNumberProperty(
  properties: Record<string, unknown> | undefined,
  key: string
): number | null {
  const value = properties?.[key];
  return typeof value === "number" ? value : null;
}

function getGeoJsonFirstRingVertices(
  geometry?: GeoJsonGeometry | null
): { lat: number; long: number }[] | undefined {
  if (!geometry || !Array.isArray(geometry.coordinates)) {
    return undefined;
  }

  if (geometry.type === "Polygon") {
    const firstRing = geometry.coordinates[0];

    if (!Array.isArray(firstRing)) {
      return undefined;
    }

    return firstRing
      .filter((coordinate): coordinate is [number, number] => {
        return (
          Array.isArray(coordinate) &&
          typeof coordinate[0] === "number" &&
          typeof coordinate[1] === "number"
        );
      })
      .map(([long, lat]) => ({ lat, long }));
  }

  return undefined;
}

function getCenterFromVertices(
  vertices?: { lat: number; long: number }[]
): { lat: number; long: number } | undefined {
  if (!vertices || vertices.length === 0) {
    return undefined;
  }

  const total = vertices.reduce(
    (acc, vertex) => {
      acc.lat += vertex.lat;
      acc.long += vertex.long;
      return acc;
    },
    { lat: 0, long: 0 }
  );

  return {
    lat: total.lat / vertices.length,
    long: total.long / vertices.length,
  };
}

export function normalizeGeoJsonFeature(
  feature: GeoJsonFeature,
  index: number
): NormalizedSoil | null {
  if (!isValidGeometry(feature.geometry)) {
    return null;
  }

  const properties = feature.properties ?? {};

  const id =
    getNumberProperty(properties, "ID1")?.toString() ??
    getNumberProperty(properties, "MSLINK")?.toString() ??
    String(index + 1);

  const codSymbol = getStringProperty(properties, "COD_SIMBOL");
  const codLegend = getStringProperty(properties, "COD_LEGEND");
  const component = getStringProperty(properties, "DSC_COMPON");
  const texture = getStringProperty(properties, "DSC_TEXTUR");
  const component1 = getStringProperty(properties, "DSC_COMPO1");
  const component2 = getStringProperty(properties, "DSC_COMPO2");

  const vertices = getGeoJsonFirstRingVertices(feature.geometry);
  const center = getCenterFromVertices(vertices);

  return {
    id,
    key: codSymbol ?? codLegend ?? component ?? id,
    name: component ?? codSymbol ?? codLegend ?? `Solo ${id}`,
    area: {
      shape: normalizeText(feature.geometry?.type ?? "unknown"),
      center,
      vertices,
      geometry: feature.geometry,
    },
    metadata: {
      source: "geojson",
      originalProperties: properties,
      codLegend,
      codSymbol,
      texture,
      component1,
      component2,
    },
  };
}
