import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
export interface SoilProperties {
    MSLINK: number;
    MAPID: number;
    COD_LEGEND: string | null;
    COD_SIMBOL: string | null;
    NUM_ORDENA: number;
    DSC_COMPON: string | null;
    DSC_TEXTUR: string | null;
    DSC_COMPO1: string | null;
    DSC_COMPO2: string | null;
    ID1: number;
    /** Derivado no cliente a partir de COD_SIMBOL (ex.: "LV", "PVA", "Magua"). */
    soilClass?: string;
}
export type SoilFeature = Feature<Polygon | MultiPolygon, SoilProperties>;
export type SoilFeatureCollection = FeatureCollection<Polygon | MultiPolygon, SoilProperties>;
/** Projeto em execução, plotado como pin sobre o mapa. */
export interface ActiveProject {
    lat: number;
    lng: number;
    title: string;
    description: string;
    urlProjeto: string;
    urlPhoto: string;
}
//# sourceMappingURL=types.d.ts.map