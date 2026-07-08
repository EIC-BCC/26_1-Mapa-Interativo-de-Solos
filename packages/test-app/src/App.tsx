import { useEffect, useMemo, useState } from "react";
import {
  MapView,
  classifyCodSimbol,
  OUTROS,
  SOIL_CLASSES,
  type SoilFeatureCollection,
  type SoilProperties,
  type ActiveProject,
} from "map-manager";
import "map-manager/style.css";
import SoilFilter from "./components/SoilFilter";

const ALL_CODES: string[] = [...SOIL_CLASSES.map((c) => c.code), OUTROS.code];
const SOILS_API_URL = "/api/soils";

interface SoilsApiResponse {
  total: number;
  data: SoilsApiItem[];
}

interface SoilsApiItem {
  metadata: {
    originalProperties: SoilProperties;
  };
  area: {
    geometry: SoilFeatureCollection["features"][number]["geometry"];
  };
}

function App() {
  const [data, setData] = useState<SoilFeatureCollection | null>(null);
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    () => new Set(ALL_CODES),
  );

  useEffect(() => {
    let cancelled = false;
    fetch(SOILS_API_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((raw: SoilsApiResponse) => {
        if (cancelled) return;
        const collection: SoilFeatureCollection = {
          type: "FeatureCollection",
          features: raw.data.map((item) => {
            const properties = item.metadata.originalProperties;
            return {
              type: "Feature",
              properties: {
                ...properties,
                soilClass: classifyCodSimbol(properties.COD_SIMBOL),
              },
              geometry: item.area.geometry,
            };
          }),
        };
        setData(collection);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Carrega os projetos ativos (camada de pins sobre o mapa).
  useEffect(() => {
    let cancelled = false;
    fetch("/projetos.json")
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)),
      )
      .then((list: ActiveProject[]) => {
        if (!cancelled) setProjects(list);
      })
      .catch(() => {
        // Sem projetos é cenário válido — apenas não plota pins.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    if (!data) return map;
    for (const feature of data.features) {
      const code = feature.properties.soilClass ?? OUTROS.code;
      map.set(code, (map.get(code) ?? 0) + 1);
    }
    return map;
  }, [data]);

  const visibleCount = useMemo(() => {
    if (!data) return 0;
    let count = 0;
    for (const feature of data.features) {
      if (activeFilters.has(feature.properties.soilClass ?? OUTROS.code)) {
        count += 1;
      }
    }
    return count;
  }, [data, activeFilters]);

  const handleToggle = (code: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleSetAll = (codes: string[]) => {
    setActiveFilters(new Set(codes));
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Mapa de Solos</h1>
          <span className="subtitle">
            Julie dos Santos Moura &amp; Gabriel Renato Oliveira Camargo
          </span>
        </div>
        <span className="subtitle">
          {data
            ? `${visibleCount.toLocaleString("pt-BR")} polígonos visíveis`
            : "Carregando dados..."}
        </span>
      </header>

      {error && (
        <div className="error-bar">Erro ao carregar solos: {error}</div>
      )}

      <SoilFilter
        counts={counts}
        activeFilters={activeFilters}
        onToggle={handleToggle}
        onSetAll={handleSetAll}
      />
      <MapView data={data} activeFilters={activeFilters} projects={projects} />
    </div>
  );
}

export default App;
