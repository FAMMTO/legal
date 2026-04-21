import { getSupabaseAdminHeaders, getSupabaseAdminUrl } from "@/lib/supabase-admin";

const COMPANIE_TABLE = "companie";
const COMPANY_CATEGORIES_TABLE = "Categorias_de_empresa";
const HIDDEN_COMPANIE_COLUMNS = new Set([
  "cotizador",
  "clabe",
  "ENTITY",
  "CATALOGO RELACIONADO",
]);
const READONLY_COMPANIE_COLUMNS = new Set(["id", "created_at"]);

export type CompanieColumn = {
  key: string;
  type: string;
  format?: string;
  required: boolean;
};

export type CompanieRow = Record<string, unknown>;

export type CompanieListing = {
  columns: CompanieColumn[];
  rows: CompanieRow[];
  totalCount: number;
  totalPages: number;
};

export type CompanieUpdatePayload = Record<string, string>;

export type CompanyCategory = {
  id: number;
  created_at: string;
  categoria: string;
  companyCount: number;
};

type OpenApiSchema = {
  definitions?: Record<
    string,
    {
      required?: string[];
      properties?: Record<
        string,
        {
          type?: string;
          format?: string;
        }
      >;
    }
  >;
};

export async function getCompanieColumns(): Promise<CompanieColumn[]> {
  const response = await fetch(getSupabaseAdminUrl("/rest/v1/"), {
    method: "GET",
    headers: getSupabaseAdminHeaders({
      Accept: "application/openapi+json",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load Supabase schema for ${COMPANIE_TABLE}.`);
  }

  const schema = (await response.json()) as OpenApiSchema;
  const definition = schema.definitions?.[COMPANIE_TABLE];
  const required = new Set(definition?.required ?? []);
  const properties = definition?.properties ?? {};

  return Object.entries(properties)
    .filter(([key]) => !HIDDEN_COMPANIE_COLUMNS.has(key))
    .map(([key, property]) => ({
      key,
      type: property.type ?? "string",
      format: property.format,
      required: required.has(key),
    }));
}

export async function getCompanieListing(
  page: number,
  pageSize: number,
  categoryId?: number | null,
): Promise<CompanieListing> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;
  const categoryFilter = categoryId ? `&categoriaempresa=eq.${categoryId}` : "";

  const [columns, dataResponse] = await Promise.all([
    getCompanieColumns(),
    fetch(getSupabaseAdminUrl(`/rest/v1/${COMPANIE_TABLE}?select=*&order=id.asc${categoryFilter}`), {
      method: "GET",
      headers: getSupabaseAdminHeaders({
        Prefer: "count=exact",
        Range: `${from}-${to}`,
        "Range-Unit": "items",
      }),
      cache: "no-store",
    }),
  ]);

  if (!dataResponse.ok) {
    throw new Error(`Could not load data from Supabase table ${COMPANIE_TABLE}.`);
  }

  const rows = (await dataResponse.json()) as CompanieRow[];
  const contentRange = dataResponse.headers.get("content-range");
  const totalCount = Number(contentRange?.split("/")[1] ?? rows.length);
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));

  return {
    columns,
    rows,
    totalCount,
    totalPages,
  };
}

export async function getCompanyCategories(): Promise<CompanyCategory[]> {
  const [categoryResponse, companyResponse] = await Promise.all([
    fetch(
      getSupabaseAdminUrl(
        `/rest/v1/${COMPANY_CATEGORIES_TABLE}?select=id,created_at,categoria&order=categoria.asc`,
      ),
      {
        method: "GET",
        headers: getSupabaseAdminHeaders(),
        cache: "no-store",
      },
    ),
    fetch(getSupabaseAdminUrl(`/rest/v1/${COMPANIE_TABLE}?select=categoriaempresa`), {
      method: "GET",
      headers: getSupabaseAdminHeaders(),
      cache: "no-store",
    }),
  ]);

  if (!categoryResponse.ok) {
    throw new Error(`Could not load categories from ${COMPANY_CATEGORIES_TABLE}.`);
  }

  if (!companyResponse.ok) {
    throw new Error(`Could not load company category references from ${COMPANIE_TABLE}.`);
  }

  const categories = (await categoryResponse.json()) as Array<{
    id: number;
    created_at: string;
    categoria: string;
  }>;
  const companies = (await companyResponse.json()) as Array<{
    categoriaempresa: number | null;
  }>;
  const categoryCounts = new Map<number, number>();

  for (const company of companies) {
    if (typeof company.categoriaempresa !== "number") {
      continue;
    }

    categoryCounts.set(
      company.categoriaempresa,
      (categoryCounts.get(company.categoriaempresa) ?? 0) + 1,
    );
  }

  return categories.map((category) => ({
    ...category,
    companyCount: categoryCounts.get(category.id) ?? 0,
  }));
}

export function getEditableCompanieColumns(columns: CompanieColumn[]) {
  return columns.filter((column) => !READONLY_COMPANIE_COLUMNS.has(column.key));
}

export function buildCompanieUpdatePayload(
  values: CompanieUpdatePayload,
  columns: CompanieColumn[],
) {
  const payload: Record<string, number | string | null> = {};

  for (const column of getEditableCompanieColumns(columns)) {
    const rawValue = values[column.key];

    if (rawValue === undefined) {
      continue;
    }

    const normalizedValue = rawValue.trim();

    if (normalizedValue === "") {
      payload[column.key] = null;
      continue;
    }

    if (column.type === "number" || column.type === "integer") {
      const numericValue = Number(normalizedValue.replace(/[^0-9.-]/g, ""));

      if (Number.isNaN(numericValue)) {
        throw new Error(`El campo ${column.key} debe contener un valor numerico valido.`);
      }

      payload[column.key] = numericValue;
      continue;
    }

    payload[column.key] = normalizedValue;
  }

  return payload;
}

export async function updateCompanie(
  companyId: number,
  payload: Record<string, number | string | null>,
) {
  const response = await fetch(
    getSupabaseAdminUrl(`/rest/v1/${COMPANIE_TABLE}?id=eq.${companyId}&select=*`),
    {
      method: "PATCH",
      headers: getSupabaseAdminHeaders({
        "Content-Type": "application/json",
        Prefer: "return=representation",
      }),
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`No se pudo actualizar la empresa ${companyId} en Supabase.`);
  }

  const data = (await response.json()) as CompanieRow[];
  return data[0] ?? null;
}

export async function deleteCompanie(companyId: number) {
  const response = await fetch(getSupabaseAdminUrl(`/rest/v1/${COMPANIE_TABLE}?id=eq.${companyId}`), {
    method: "DELETE",
    headers: getSupabaseAdminHeaders({
      Prefer: "return=minimal",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`No se pudo borrar la empresa ${companyId} en Supabase.`);
  }
}
