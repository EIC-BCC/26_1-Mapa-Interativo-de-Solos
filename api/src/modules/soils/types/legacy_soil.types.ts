export type LegacySoil = {
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
  };
  metadata?: {
    region?: string;
    source?: string;
    active?: boolean;
    createdAt?: string;
  };
};
