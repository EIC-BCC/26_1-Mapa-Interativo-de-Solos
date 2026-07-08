import type { LegacySoil } from "../types/legacy_soil.types";
import type { NormalizedSoil } from "../types/soil.types";

function normalizeText(value?: string | null): string {
  return value?.trim().toLowerCase() ?? "";
}

export function normalizeLegacySoil(soil: LegacySoil): NormalizedSoil {
  return {
    id: soil.id,
    key: soil.key,
    name: soil.name,
    area: {
      shape: normalizeText(soil.area.shape),
      center: soil.area.center,
      radius: soil.area.radius,
      vertices: soil.area.vertices,
    },
    metadata: {
      source: "legacy",
    },
  };
}
