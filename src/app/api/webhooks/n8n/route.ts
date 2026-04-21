import { NextRequest, NextResponse } from "next/server";
import {
  normalizeMaterialityWebhookPayload,
  storeMaterialityMessage,
} from "@/lib/materiality";

function getExpectedSecret() {
  return process.env.N8N_WEBHOOK_SECRET?.trim() ?? "";
}

function getProvidedSecret(request: NextRequest) {
  const headerSecret =
    request.headers.get("x-n8n-secret") ?? request.headers.get("x-webhook-secret");

  if (headerSecret) {
    return headerSecret.trim();
  }

  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return "";
}

export async function POST(request: NextRequest) {
  const expectedSecret = getExpectedSecret();
  const providedSecret = getProvidedSecret(request);

  if (expectedSecret && providedSecret !== expectedSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized webhook request.",
      },
      {
        status: 401,
      },
    );
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

  try {
    const materialityMessage = normalizeMaterialityWebhookPayload(body);

    if (materialityMessage) {
      await storeMaterialityMessage(materialityMessage);
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
    authMode: expectedSecret ? "secret" : "open",
    message: "Webhook JSON received successfully.",
  });
}
