import request from "supertest";

jest.mock("../modules/soils/repositories/soil.repository", () => ({
  SoilRepository: jest.fn().mockImplementation(() => ({
    findAll: jest
      .fn()
      .mockRejectedValue(new Error("Erro ao buscar solos no JSON Server")),
  })),
}));

import app from "../index";

describe("GET /soils - cenário de erro", () => {
  it("retorna 500 com mensagem padronizada quando a fonte de dados falha", async () => {
    const response = await request(app).get("/soils");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Erro interno ao buscar solos",
    });
  });
});
