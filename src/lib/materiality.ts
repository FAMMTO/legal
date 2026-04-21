import { getSupabaseAdminHeaders, getSupabaseAdminUrl } from "@/lib/supabase-admin";

const MENSAJES_TABLE = "mensajes";
const MATERIALITY_EVENT_NAME = "mensaje_del_cliente";
const MATERIALITY_STORAGE_PREFIX = "N8N-MATERIALIDAD:";

type UnknownRecord = Record<string, unknown>;

type StoredMaterialityMessage = {
  source: string;
  event: string;
  timestamp: string;
  payload: {
    nombre: string;
    correo: string;
    mensaje: string;
    empresaDelServicio: string;
  };
};

type MensajeRow = {
  id: number;
  created_at: string;
  mensaje_ia_contexto: string | null;
};

export type MaterialityMessage = {
  id: number;
  createdAt: string;
  source: string;
  event: string;
  timestamp: string;
  nombre: string;
  correo: string;
  mensaje: string;
  empresaDelServicio: string;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function buildMaterialityStorageValue(message: StoredMaterialityMessage) {
  return `${MATERIALITY_STORAGE_PREFIX}${JSON.stringify(message)}`;
}

function parseMaterialityRow(row: MensajeRow): MaterialityMessage | null {
  const rawValue = row.mensaje_ia_contexto ?? "";

  if (!rawValue.startsWith(MATERIALITY_STORAGE_PREFIX)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      rawValue.slice(MATERIALITY_STORAGE_PREFIX.length),
    ) as StoredMaterialityMessage;

    return {
      id: row.id,
      createdAt: row.created_at,
      source: readString(parsed.source) || "n8n",
      event: readString(parsed.event) || MATERIALITY_EVENT_NAME,
      timestamp: readString(parsed.timestamp) || row.created_at,
      nombre: readString(parsed.payload?.nombre),
      correo: readString(parsed.payload?.correo),
      mensaje: readString(parsed.payload?.mensaje),
      empresaDelServicio: readString(parsed.payload?.empresaDelServicio),
    };
  } catch {
    return null;
  }
}

export function normalizeMaterialityWebhookPayload(body: unknown): StoredMaterialityMessage | null {
  if (!isRecord(body)) {
    return null;
  }

  const event = readString(body.event);

  if (event !== MATERIALITY_EVENT_NAME) {
    return null;
  }

  const payload = isRecord(body.payload) ? body.payload : {};
  const empresaDelServicio =
    readString(payload.empresa_del_servicio) ||
    readString(payload["empresa_del_servicio "]) ||
    readString(payload.empresaDelServicio);

  return {
    source: readString(body.source) || "n8n",
    event,
    timestamp: readString(body.timestamp) || new Date().toISOString(),
    payload: {
      nombre: readString(payload.nombre),
      correo: readString(payload.correo),
      mensaje: readString(payload.mensaje),
      empresaDelServicio,
    },
  };
}

export async function storeMaterialityMessage(message: StoredMaterialityMessage) {
  const response = await fetch(getSupabaseAdminUrl(`/rest/v1/${MENSAJES_TABLE}`), {
    method: "POST",
    headers: getSupabaseAdminHeaders({
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }),
    body: JSON.stringify({
      mensaje_ia_contexto: buildMaterialityStorageValue(message),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar el mensaje de materialidad en Supabase.");
  }

  const rows = (await response.json()) as MensajeRow[];
  return rows[0] ? parseMaterialityRow(rows[0]) : null;
}

export async function getMaterialityMessages(limit = 20): Promise<MaterialityMessage[]> {
  const params = new URLSearchParams({
    select: "id,created_at,mensaje_ia_contexto",
    order: "id.desc",
    limit: String(Math.max(1, limit)),
  });

  params.set("mensaje_ia_contexto", `like.${MATERIALITY_STORAGE_PREFIX}*`);

  const response = await fetch(
    getSupabaseAdminUrl(`/rest/v1/${MENSAJES_TABLE}?${params.toString()}`),
    {
      method: "GET",
      headers: getSupabaseAdminHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar los mensajes de materialidad desde Supabase.");
  }

  const rows = (await response.json()) as MensajeRow[];

  return rows
    .map((row) => parseMaterialityRow(row))
    .filter((row): row is MaterialityMessage => row !== null);
}
