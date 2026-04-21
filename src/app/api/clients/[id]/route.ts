import { NextRequest, NextResponse } from "next/server";
import {
  buildClientUpdatePayload,
  deleteClient,
  getClientColumns,
  updateClient,
} from "@/lib/clients";

type ClientRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseClientId(rawId: string) {
  const clientId = Number(rawId);

  if (!Number.isFinite(clientId) || clientId <= 0) {
    throw new Error("Identificador de cliente invalido.");
  }

  return Math.floor(clientId);
}

export async function PUT(request: NextRequest, context: ClientRouteContext) {
  try {
    const { id } = await context.params;
    const clientId = parseClientId(id);
    const body = (await request.json()) as {
      values?: Record<string, string>;
    };
    const columns = await getClientColumns();
    const payload = buildClientUpdatePayload(body.values ?? {}, columns);
    const client = await updateClient(clientId, payload);

    return NextResponse.json({
      client,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudo actualizar el cliente.",
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(_request: NextRequest, context: ClientRouteContext) {
  try {
    const { id } = await context.params;
    const clientId = parseClientId(id);
    await deleteClient(clientId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudo borrar el cliente.",
      },
      {
        status: 400,
      },
    );
  }
}
