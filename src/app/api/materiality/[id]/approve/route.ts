import { NextRequest, NextResponse } from "next/server";
import { getMaterialityRecordById } from "@/lib/materiality";

const DEFAULT_APPROVAL_WEBHOOK_URL =
  "https://n8n.mastercode.com.mx/webhook/87078452-5379-4607-a1ad-3451b7e543b6";

function getApprovalWebhookUrl() {
  return process.env.N8N_MATERIALITY_APPROVAL_WEBHOOK_URL?.trim() || DEFAULT_APPROVAL_WEBHOOK_URL;
}

function parseMaterialityId(value: string) {
  const parsedId = Number.parseInt(value, 10);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

export async function POST(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await context.params;
    const materialityId = parseMaterialityId(id);

    if (!materialityId) {
      throw new Error("Identificador de materialidad invalido.");
    }

    const materialityRecord = await getMaterialityRecordById(materialityId);

    if (!materialityRecord) {
      return NextResponse.json(
        {
          ok: false,
          error: "No se encontro el registro solicitado en tabla_de_n8n.",
        },
        {
          status: 404,
        },
      );
    }

    const approvalPayload = {
      event: "materialidad_aprobada",
      source: "legal-app",
      approved_at: new Date().toISOString(),
      id: materialityRecord.id,
      created_at: materialityRecord.created_at,
      correo_peticion: materialityRecord.correo_peticion,
      contexto: materialityRecord.contexto,
      correo_id: materialityRecord.correo_id,
      url_del_pdf: materialityRecord.url_del_pdf,
      account_id: materialityRecord.account_id,
      conversation_id: materialityRecord.conversation_id,
      inbox_id: materialityRecord.inbox_id,
    };

    const webhookResponse = await fetch(getApprovalWebhookUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(approvalPayload),
      cache: "no-store",
    });

    const responseText = await webhookResponse.text();

    if (!webhookResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo entregar la aprobacion al webhook externo.",
          status: webhookResponse.status,
          response: responseText,
        },
        {
          status: 502,
        },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "La aprobacion se envio correctamente al webhook de n8n.",
      materialityId,
      webhookStatus: webhookResponse.status,
      webhookResponse: responseText,
      payload: approvalPayload,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo procesar la aprobacion de materialidad.",
      },
      {
        status: 500,
      },
    );
  }
}
