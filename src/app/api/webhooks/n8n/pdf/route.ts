import { NextRequest, NextResponse } from "next/server";
import {
  attachMaterialityPdfUrl,
  normalizeMaterialityPdfLinkPayload,
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

  console.log("[n8n pdf webhook received]", JSON.stringify(body));

  const pdfLinkPayload = normalizeMaterialityPdfLinkPayload(body);

  if (!pdfLinkPayload) {
    return NextResponse.json(
      {
        ok: false,
        error: "Body must include a valid id and url/url_del_pdf/pdf_url.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const updatedRecord = await attachMaterialityPdfUrl(pdfLinkPayload);

    return NextResponse.json({
      ok: true,
      receivedAt: new Date().toISOString(),
      authMode: getN8nAuthMode(),
      message: "PDF linked successfully.",
      materiality: updatedRecord,
    });
  } catch (error) {
    console.error("[n8n pdf webhook] could not link pdf", error);

    return NextResponse.json(
      {
        ok: false,
        error: "PDF URL received but could not be linked to tabla_de_n8n.",
      },
      {
        status: 500,
      },
    );
  }
}
