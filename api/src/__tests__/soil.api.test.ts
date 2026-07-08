import request from "supertest";

const fixture = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        ID1: 1,
        COD_SIMBOL: "LVA1",
        COD_LEGEND: "001LVA",
        DSC_COMPON: "Latossolo Vermelho-Amarelo",
        DSC_TEXTUR: "argilosa",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-43.2, -22.9],
            [-43.1, -22.9],
            [-43.1, -23.0],
            [-43.2, -23.0],
            [-43.2, -22.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        ID1: 2,
        COD_SIMBOL: "CX1",
        COD_LEGEND: "002CX",
        DSC_COMPON: "Cambissolo Háplico",
        DSC_TEXTUR: "média",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-44.0, -20.0],
            [-43.9, -20.0],
            [-43.9, -20.1],
            [-44.0, -20.1],
            [-44.0, -20.0],
          ],
        ],
      },
    },
  ],
};

jest.mock("../modules/soils/repositories/soil.repository", () => ({
  SoilRepository: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue(fixture),
  })),
}));

import app from "../index";

describe("GET /soils", () => {
  it("retorna 200 com o contrato data + filters + total", async () => {
    const response = await request(app).get("/soils");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("filters");
    expect(response.body.total).toBe(2);
    expect(response.body.data).toHaveLength(2);
  });

  it("filtra por soilType corretamente", async () => {
    const response = await request(app).get("/soils?soilType=cambissolo");

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
    expect(response.body.data[0].name).toBe("Cambissolo Háplico");
  });

  it("filtra por texture corretamente", async () => {
    const response = await request(app).get("/soils?texture=argilosa");

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
    expect(response.body.data[0].metadata.texture).toBe("argilosa");
  });

  it("retorna lista vazia quando nenhum registro casa com o filtro", async () => {
    const response = await request(app).get("/soils?soilType=inexistente");

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(0);
    expect(response.body.data).toEqual([]);
  });

  it("ecoa os filtros aplicados na resposta", async () => {
    const response = await request(app).get(
      "/soils?soilType=A&soilShape=polygon"
    );

    expect(response.body.filters.soilType).toBe("a");
    expect(response.body.filters.soilShape).toBe("polygon");
  });
});
