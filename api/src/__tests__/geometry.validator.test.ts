import { isValidGeometry } from "../modules/soils/validators/geometry.validator";

describe("isValidGeometry", () => {
  it("retorna false quando a geometria é nula ou ausente", () => {
    expect(isValidGeometry(null)).toBe(false);
    expect(isValidGeometry(undefined)).toBe(false);
  });

  it("retorna false para tipo de geometria não suportado", () => {
    expect(
      isValidGeometry({ type: "Point", coordinates: [-43.2, -22.9] })
    ).toBe(false);
  });

  it("retorna false quando coordinates não é array", () => {
    expect(
      isValidGeometry({ type: "Polygon", coordinates: "invalid" as never })
    ).toBe(false);
  });

  it("retorna false quando há coordenada NaN", () => {
    const geometry = {
      type: "Polygon",
      coordinates: [
        [
          [Number.NaN, -22.9],
          [-43.2, -22.9],
          [-43.2, -23.0],
          [Number.NaN, -22.9],
        ],
      ],
    };

    expect(isValidGeometry(geometry)).toBe(false);
  });

  it("retorna true para um polígono simples e válido", () => {
    const geometry = {
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

    expect(isValidGeometry(geometry)).toBe(true);
  });

  it("retorna false para polígono com anel não fechado", () => {
    const geometry = {
      type: "Polygon",
      coordinates: [
        [
          [-43.2, -22.9],
          [-43.1, -22.9],
          [-43.1, -23.0],
          [-43.2, -23.0],
        ],
      ],
    };

    expect(isValidGeometry(geometry)).toBe(false);
  });
});
