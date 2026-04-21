import { NextRequest, NextResponse } from "next/server";
import {
  buildCompanieUpdatePayload,
  deleteCompanie,
  getCompanieColumns,
  updateCompanie,
} from "@/lib/companies";

type CompanyRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseCompanyId(rawId: string) {
  const companyId = Number(rawId);

  if (!Number.isFinite(companyId) || companyId <= 0) {
    throw new Error("Identificador de empresa invalido.");
  }

  return Math.floor(companyId);
}

export async function PUT(request: NextRequest, context: CompanyRouteContext) {
  try {
    const { id } = await context.params;
    const companyId = parseCompanyId(id);
    const body = (await request.json()) as {
      values?: Record<string, string>;
    };
    const columns = await getCompanieColumns();
    const payload = buildCompanieUpdatePayload(body.values ?? {}, columns);
    const company = await updateCompanie(companyId, payload);

    return NextResponse.json({
      company,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudo actualizar la empresa.",
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(_request: NextRequest, context: CompanyRouteContext) {
  try {
    const { id } = await context.params;
    const companyId = parseCompanyId(id);
    await deleteCompanie(companyId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudo borrar la empresa.",
      },
      {
        status: 400,
      },
    );
  }
}
