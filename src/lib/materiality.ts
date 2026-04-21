import { getSupabaseAdminHeaders, getSupabaseAdminUrl } from "@/lib/supabase-admin";

const MATERIALITY_TABLE = "tabla_de_n8n";
const MATERIALITY_EVENT_NAME = "mensaje_del_cliente";

type UnknownRecord = Record<string, unknown>;

type MaterialityInsertPayload = {
  correo_peticion: string | null;
  contexto: string | null;
  correo_id: string | null;
};

type MaterialityRow = {
  id: number;
  created_at: string;
  correo_peticion: string | null;
  contexto: string | null;
  correo_id: string | null;
};

export type MaterialityMessage = {
  id: number;
  createdAt: string;
  correoPeticion: string;
  contexto: string;
  correoId: string;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readFirstString(...values: unknown[]) {
  for (const value of values) {
    const normalizedValue = readString(value);

    if (normalizedValue) {
      return normalizedValue;
    }
  }

  return "";
}

function parseMaterialityRow(row: MaterialityRow): MaterialityMessage {
  return {
    id: row.id,
    createdAt: row.created_at,
    correoPeticion: readString(row.correo_peticion),
    contexto: readString(row.contexto),
    correoId: readString(row.correo_id),
  };
}

export function normalizeMaterialityWebhookPayload(body: unknown): MaterialityInsertPayload | null {
  if (!isRecord(body)) {
    return null;
  }

  const event = readString(body.event);

  if (event !== MATERIALITY_EVENT_NAME) {
    return null;
  }

  const payload = isRecord(body.payload) ? body.payload : {};

  const correoPeticion = readFirstString(
    payload.correo_peticion,
    payload.correoPeticion,
    payload["Correo peticion"],
    payload.empresa_del_servicio,
    payload["empresa_del_servicio "],
    body.correo_peticion,
  );

  const contexto = readFirstString(payload.contexto, payload.mensaje, body.contexto);
  const correoId = readFirstString(
    payload.correo_id,
    payload.correoId,
    payload.correo,
    payload.nombre,
    body.correo_id,
  );

  return {
    correo_peticion: correoPeticion || null,
    contexto: contexto || null,
    correo_id: correoId || null,
  };
}

export async function storeMaterialityMessage(payload: MaterialityInsertPayload) {
  const response = await fetch(getSupabaseAdminUrl(`/rest/v1/${MATERIALITY_TABLE}`), {
    method: "POST",
    headers: getSupabaseAdminHeaders({
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar el registro de n8n en tabla_de_n8n.");
  }

  const rows = (await response.json()) as MaterialityRow[];
  return rows[0] ? parseMaterialityRow(rows[0]) : null;
}

export async function getMaterialityMessages(limit = 20): Promise<MaterialityMessage[]> {
  const params = new URLSearchParams({
    select: "id,created_at,correo_peticion,contexto,correo_id",
    order: "id.desc",
    limit: String(Math.max(1, limit)),
  });

  const response = await fetch(
    getSupabaseAdminUrl(`/rest/v1/${MATERIALITY_TABLE}?${params.toString()}`),
    {
      method: "GET",
      headers: getSupabaseAdminHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar los registros de tabla_de_n8n desde Supabase.");
  }

  const rows = (await response.json()) as MaterialityRow[];
  return rows.map((row) => parseMaterialityRow(row));
}
