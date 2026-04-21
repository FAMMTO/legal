import Link from "next/link";

type CompaniesViewTabsProps = {
  activeView: "todas" | "categorias";
};

export function CompaniesViewTabs({ activeView }: CompaniesViewTabsProps) {
  return (
    <div className="companies-view-tabs">
      <Link
        className={`companies-view-tab${activeView === "todas" ? " is-active" : ""}`}
        href="/empresas"
      >
        Todas
      </Link>
      <Link
        className={`companies-view-tab${activeView === "categorias" ? " is-active" : ""}`}
        href="/empresas?view=categorias"
      >
        Categorias
      </Link>
    </div>
  );
}
