import { ClientsList } from "@/components/workspace/clients-list";
import { getClientListing } from "@/lib/clients";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

type ClientesPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

function buildPageHref(page: number) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  return `/clientes?${searchParams.toString()}`;
}

export default async function ClientesPage({ searchParams }: ClientesPageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedPage = Number(resolvedSearchParams.page ?? "1");
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;

  const listing = await getClientListing(currentPage, PAGE_SIZE);

  if (currentPage > listing.totalPages) {
    redirect(buildPageHref(listing.totalPages));
  }

  return (
    <ClientsList
      columns={listing.columns}
      rows={listing.rows}
      currentPage={currentPage}
      pageSize={PAGE_SIZE}
      totalPages={listing.totalPages}
      totalCount={listing.totalCount}
    />
  );
}
