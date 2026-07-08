import { type Request } from "express";
import { ParsedQs } from "qs";
import type { SoilQueryParams } from "../types/soil.types";

type QueryParam = string | ParsedQs | (string | ParsedQs)[] | undefined;

function getSingleQueryParam(value: QueryParam): string | undefined {
  if (!value) return undefined;

  if (Array.isArray(value)) {
    const firstValue = value[0];
    return typeof firstValue === "string" ? firstValue : undefined;
  }

  return typeof value === "string" ? value : undefined;
}

function normalizeQueryValue(value?: string): string | undefined {
  return value?.trim().toLowerCase();
}

export function handleSoilQueryParams(request: Request): SoilQueryParams {
  return {
    soilType: normalizeQueryValue(getSingleQueryParam(request.query.soilType)),
    soilShape: normalizeQueryValue(getSingleQueryParam(request.query.soilShape)),
    text: normalizeQueryValue(getSingleQueryParam(request.query.text)),
    texture: normalizeQueryValue(getSingleQueryParam(request.query.texture)),
  };
}
