import Link from "next/link";
import { CompaniesViewTabs } from "@/components/workspace/companies-view-tabs";
import { LiveRefreshControls } from "@/components/workspace/live-refresh-controls";
import type { CompanyCategory } from "@/lib/companies";

type CompanyCategoriesProps = {
  categories: CompanyCategory[];
};

function formatCompaniesCount(count: number) {
  return `${count} ${count === 1 ? "empresa" : "empresas"}`;
}

export function CompanyCategories({ categories }: CompanyCategoriesProps) {
  return (
    <section className="section-card companies-shell">
      <div className="companies-toolbar">
        <div className="section-head">
          <span className="section-kicker">Supabase conectado</span>
          <h1 className="section-title companies-title">Categorias de empresa</h1>
          <p className="section-description">
            Selecciona una categoria para abrir el listado de empresas asociadas.
          </p>
        </div>

        <div className="companies-toolbar-side">
          <CompaniesViewTabs activeView="categorias" />
          <div className="companies-toolbar-actions">
            <LiveRefreshControls />
            <div className="companies-summary">
              {categories.length}{" "}
              {categories.length === 1 ? "categoria disponible" : "categorias disponibles"}
            </div>
          </div>
        </div>
      </div>

      <div className="company-categories-grid">
        {categories.map((category) => (
          <article className="company-category-card" key={category.id}>
            <div className="company-category-copy">
              <span className="section-kicker">Categoria #{category.id}</span>
              <h2 className="company-category-title">{category.categoria}</h2>
              <p className="company-category-meta">{formatCompaniesCount(category.companyCount)}</p>
            </div>
            <Link className="secondary-button company-category-action" href={`/empresas?category=${category.id}`}>
              Ver empresas
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
