import { CompanyCategories } from "@/components/workspace/company-categories";
import { CompaniesList } from "@/components/workspace/companies-list";
import { getCompanieListing, getCompanyCategories } from "@/lib/companies";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

type EmpresasPageProps = {
  searchParams: Promise<{
    page?: string;
    view?: string;
    category?: string;
  }>;
};

function buildPageHref(page: number, categoryId?: number | null) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));

  if (categoryId) {
    searchParams.set("category", String(categoryId));
  }

  return `/empresas?${searchParams.toString()}`;
}

export default async function EmpresasPage({ searchParams }: EmpresasPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeView = resolvedSearchParams.view === "categorias" ? "categorias" : "todas";
  const requestedPage = Number(resolvedSearchParams.page ?? "1");
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const requestedCategoryId = Number(resolvedSearchParams.category ?? "");
  const activeCategoryId =
    Number.isFinite(requestedCategoryId) && requestedCategoryId > 0
      ? Math.floor(requestedCategoryId)
      : null;
  const categories = await getCompanyCategories();
  const activeCategory =
    activeCategoryId === null
      ? null
      : categories.find((category) => category.id === activeCategoryId) ?? null;

  if (activeCategoryId !== null && !activeCategory) {
    redirect("/empresas");
  }

  if (activeView === "categorias") {
    return <CompanyCategories categories={categories} />;
  }

  const listing = await getCompanieListing(currentPage, PAGE_SIZE, activeCategory?.id ?? null);

  if (currentPage > listing.totalPages) {
    redirect(buildPageHref(listing.totalPages, activeCategory?.id ?? null));
  }

  return (
    <CompaniesList
      columns={listing.columns}
      rows={listing.rows}
      currentPage={currentPage}
      pageSize={PAGE_SIZE}
      totalPages={listing.totalPages}
      totalCount={listing.totalCount}
      categoryNamesById={Object.fromEntries(
        categories.map((category) => [String(category.id), category.categoria]),
      )}
      activeCategory={
        activeCategory
          ? {
              id: activeCategory.id,
              categoria: activeCategory.categoria,
            }
          : null
      }
    />
  );
}
