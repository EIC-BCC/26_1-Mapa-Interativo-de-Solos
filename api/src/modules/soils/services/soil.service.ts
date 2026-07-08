import { SoilRepository } from "../repositories/soil.repository";
import { normalizeSoils } from "../normalizers/soil.normalizer";
import { filterSoils } from "../filters/soil.filter";
import type { NormalizedSoil, SoilQueryParams } from "../types/soil.types";

const soilRepository = new SoilRepository();

export class SoilService {
  private cachedSoils: NormalizedSoil[] | null = null;
  private validationStats: {
    totalFeatures: number;
    discardedByInvalidGeometry: number;
  } | null = null;

  async warmUp(): Promise<void> {
    await this.getNormalizedSoils();
  }

  async findAll(filters: SoilQueryParams): Promise<NormalizedSoil[]> {
    const soils = await this.getNormalizedSoils();

    return filterSoils(soils, filters);
  }

  getValidationStats() {
    return this.validationStats;
  }

  private async getNormalizedSoils(): Promise<NormalizedSoil[]> {
    if (this.cachedSoils) {
      return this.cachedSoils;
    }

    const rawData = await soilRepository.findAll();
    const { soils, totalFeatures, discardedByInvalidGeometry } =
      normalizeSoils(rawData);

    this.validationStats = { totalFeatures, discardedByInvalidGeometry };

    if (discardedByInvalidGeometry > 0) {
      console.warn(
        `[SoilService] ${discardedByInvalidGeometry} de ${totalFeatures} feições descartadas por geometria inválida.`
      );
    }

    this.cachedSoils = soils;

    return soils;
  }
}

export const soilService = new SoilService();
