import type { Request, Response } from "express";
import { soilService } from "./services/soil.service";
import { handleSoilQueryParams } from "./handlers/soil_query.handler";

export class SoilController {
  async get(request: Request, response: Response) {
    try {
      const filters = handleSoilQueryParams(request);
      const soils = await soilService.findAll(filters);

      return response.json({
        filters: {
          soilType: filters.soilType ?? null,
          soilShape: filters.soilShape ?? null,
          texture: filters.texture ?? null,
          text: filters.text ?? null,
        },
        total: soils.length,
        data: soils,
      });
    } catch (error) {
      console.error(error);

      return response.status(500).json({
        message: "Erro interno ao buscar solos",
      });
    }
  }
}
