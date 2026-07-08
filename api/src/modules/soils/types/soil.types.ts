export type SoilQueryParams = {
  soilType?: string;
  soilShape?: string;
  text?: string;
  texture?: string;
};

export type NormalizedSoil = {
  id: string;
  key: string;
  name: string;
  area: {
    shape: string;
    center?: {
      lat: number;
      long: number;
    };
    radius?: number;
    vertices?: {
      lat: number;
      long: number;
    }[];
    geometry?: unknown;
  };
  metadata: {
    source: "legacy" | "geojson";
    originalProperties?: Record<string, unknown>;
    codLegend?: string | null;
    codSymbol?: string | null;
    texture?: string | null;
    component1?: string | null;
    component2?: string | null;
  };
};
