import { normalizeSoils } from "../modules/soils/normalizers/soil.normalizer";

const validPolygon = {
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
};

const invalidPolygon = {
  type: "Polygon",
  coordinates: [
    [
      [-43.2, -22.9],
      [-43.1, -22.9],
      [-43.1, -23.0],
    ],
  ],
};

describe("normalizeSoils", () => {
  it("normaliza apenas features com geometria válida e conta as descartadas", () => {
    const rawData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { ID1: 1, COD_SIMBOL: "LVA1" },
          geometry: validPolygon,
        },
        {
          type: "Feature",
          properties: { ID1: 2, COD_SIMBOL: "LVA2" },
          geometry: invalidPolygon,
        },
      ],
    };

    const result = normalizeSoils(rawData);

    expect(result.totalFeatures).toBe(2);
    expect(result.soils).toHaveLength(1);
    expect(result.discardedByInvalidGeometry).toBe(1);
    expect(result.soils[0]?.key).toBe("LVA1");
  });

  it("não descarta nada quando todas as geometrias são válidas", () => {
    const rawData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { ID1: 1, COD_SIMBOL: "LVA1" },
          geometry: validPolygon,
        },
      ],
    };

    const result = normalizeSoils(rawData);

    expect(result.discardedByInvalidGeometry).toBe(0);
    expect(result.soils).toHaveLength(1);
  });

  it("retorna lista vazia para payload não reconhecido", () => {
    const result = normalizeSoils({ unexpected: true });

    expect(result.soils).toHaveLength(0);
    expect(result.totalFeatures).toBe(0);
    expect(result.discardedByInvalidGeometry).toBe(0);
  });
});
