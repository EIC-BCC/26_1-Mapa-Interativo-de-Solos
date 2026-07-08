import { SoilFeatureCollection, ActiveProject } from './types';
export interface MapViewProps {
    /** GeoJSON com as features de solo já anotadas com `soilClass`. */
    data: SoilFeatureCollection | null;
    /** Conjunto de códigos de classe atualmente visíveis. */
    activeFilters: Set<string>;
    /** Projetos em execução plotados como pins sobre o mapa. */
    projects?: ActiveProject[];
    /** Estilo de mapa-base do MapLibre. */
    mapStyle?: string;
    /** View inicial — default centralizado no Brasil. */
    initialViewState?: {
        longitude: number;
        latitude: number;
        zoom: number;
    };
}
export default function MapView({ data, activeFilters, projects, mapStyle, initialViewState, }: MapViewProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MapView.d.ts.map