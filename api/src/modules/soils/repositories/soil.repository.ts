const SOILS_MOCK_BASE_URL =
  process.env.SOILS_MOCK_BASE_URL || "http://localhost:3001";

export class SoilRepository {
  async findAll(): Promise<unknown> {
    const url = new URL(`${SOILS_MOCK_BASE_URL}/soils`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar solos no JSON Server");
    }

    return response.json();
  }
}
