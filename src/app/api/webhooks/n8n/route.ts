import { NextRequest, NextResponse } from "next/server";
import {
  normalizeMaterialityWebhookPayload,
  storeMaterialityMessage,
} from "@/lib/materiality";
import { getN8nAuthMode, getUnauthorizedN8nResponse } from "@/lib/n8n-webhook";

export async function POST(request: NextRequest) {
  const unauthorizedResponse = getUnauthorizedN8nResponse(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid JSON body.",
      },
      {
        status: 400,
      },
    );
  }

  console.log("[n8n webhook received]", JSON.stringify(body));

  let storedRecord = null;

  try {
    const materialityMessage = normalizeMaterialityWebhookPayload(body);

    if (materialityMessage) {
      storedRecord = await storeMaterialityMessage(materialityMessage);
    }
  } catch (error) {
    console.error("[n8n webhook] could not persist materiality message", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Webhook received but the message could not be stored.",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
    authMode: getN8nAuthMode(),
    message: storedRecord
      ? "Webhook JSON received and saved successfully."
      : "Webhook JSON received successfully.",
    materiality: storedRecord,
  });
}
