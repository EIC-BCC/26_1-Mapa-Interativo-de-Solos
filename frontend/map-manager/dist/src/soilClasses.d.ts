export interface SoilClass {
    code: string;
    label: string;
    color: string;
    /** Descrição curta exibida ao passar o mouse sobre a classe na legenda. */
    description: string;
}
export declare const SOIL_CLASSES: SoilClass[];
export declare const OUTROS: SoilClass;
/** Retorna o registro do catálogo para o código fornecido (ou "Outros"). */
export declare function getSoilClass(code: string | null | undefined): SoilClass;
/** Extrai as letras iniciais de COD_SIMBOL e mapeia para um código do catálogo. */
export declare function classifyCodSimbol(codSimbol: string | null | undefined): string;
//# sourceMappingURL=soilClasses.d.ts.map