import { getSupabaseAdminHeaders, getSupabaseAdminUrl } from "@/lib/supabase-admin";

const CLIENTS_TABLE = "clients";
const READONLY_CLIENT_COLUMNS = new Set(["id", "created_at"]);

export type ClientColumn = {
  key: string;
  type: string;
  format?: string;
  required: boolean;
};

export type ClientRow = Record<string, unknown>;

export type ClientListing = {
  columns: ClientColumn[];
  rows: ClientRow[];
  totalCount: number;
  totalPages: number;
};

export type ClientUpdatePayload = Record<string, string>;

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

export async function getClientColumns(): Promise<ClientColumn[]> {
  const response = await fetch(getSupabaseAdminUrl("/rest/v1/"), {
    method: "GET",
    headers: getSupabaseAdminHeaders({
      Accept: "application/openapi+json",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load Supabase schema for ${CLIENTS_TABLE}.`);
  }

  const schema = (await response.json()) as OpenApiSchema;
  const definition = schema.definitions?.[CLIENTS_TABLE];
  const required = new Set(definition?.required ?? []);
  const properties = definition?.properties ?? {};

  return Object.entries(properties).map(([key, property]) => ({
    key,
    type: property.type ?? "string",
    format: property.format,
    required: required.has(key),
  }));
}

export async function getClientListing(page: number, pageSize: number): Promise<ClientListing> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const [columns, dataResponse] = await Promise.all([
    getClientColumns(),
    fetch(getSupabaseAdminUrl(`/rest/v1/${CLIENTS_TABLE}?select=*&order=id.asc`), {
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
    throw new Error(`Could not load data from Supabase table ${CLIENTS_TABLE}.`);
  }

  const rows = (await dataResponse.json()) as ClientRow[];
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

export function getEditableClientColumns(columns: ClientColumn[]) {
  return columns.filter((column) => !READONLY_CLIENT_COLUMNS.has(column.key));
}

export function buildClientUpdatePayload(values: ClientUpdatePayload, columns: ClientColumn[]) {
  const payload: Record<string, number | string | null> = {};

  for (const column of getEditableClientColumns(columns)) {
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

export async function updateClient(clientId: number, payload: Record<string, number | string | null>) {
  const response = await fetch(getSupabaseAdminUrl(`/rest/v1/${CLIENTS_TABLE}?id=eq.${clientId}&select=*`), {
    method: "PATCH",
    headers: getSupabaseAdminHeaders({
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`No se pudo actualizar el cliente ${clientId} en Supabase.`);
  }

  const data = (await response.json()) as ClientRow[];
  return data[0] ?? null;
}

export async function deleteClient(clientId: number) {
  const response = await fetch(getSupabaseAdminUrl(`/rest/v1/${CLIENTS_TABLE}?id=eq.${clientId}`), {
    method: "DELETE",
    headers: getSupabaseAdminHeaders({
      Prefer: "return=minimal",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`No se pudo borrar el cliente ${clientId} en Supabase.`);
  }
}
