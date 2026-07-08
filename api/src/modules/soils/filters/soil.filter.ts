import type { NormalizedSoil, SoilQueryParams } from "../types/soil.types";

function normalizeText(value?: string | null): string {
  return value?.trim().toLowerCase() ?? "";
}

function matchesText(value: string | null | undefined, query?: string): boolean {
  if (!query) {
    return true;
  }

  return normalizeText(value).includes(query);
}

export function filterSoils(
  soils: NormalizedSoil[],
  filters: SoilQueryParams
): NormalizedSoil[] {
  const { soilType, soilShape, text, texture } = filters;

  return soils.filter((soil) => {
    const matchesType = soilType
      ? [
          soil.key,
          soil.name,
          soil.metadata.codSymbol,
          soil.metadata.codLegend,
          soil.metadata.component1,
          soil.metadata.component2,
        ].some((value) => matchesText(value, soilType))
      : true;

    const matchesShape = soilShape
      ? normalizeText(soil.area.shape) === soilShape
      : true;

    const matchesTexture = texture
      ? matchesText(soil.metadata.texture, texture)
      : true;

    const matchesFreeText = text
      ? [
          soil.key,
          soil.name,
          soil.area.shape,
          soil.metadata.codSymbol,
          soil.metadata.codLegend,
          soil.metadata.texture,
          soil.metadata.component1,
          soil.metadata.component2,
        ].some((value) => matchesText(value, text))
      : true;

    return matchesType && matchesShape && matchesTexture && matchesFreeText;
  });
}
