"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState, useTransition } from "react";
import type { CompanieColumn, CompanieRow } from "@/lib/companies";
import { CompaniesViewTabs } from "@/components/workspace/companies-view-tabs";
import { ExpandableTextModal } from "@/components/ui/expandable-text-modal";
import { LiveRefreshControls } from "@/components/workspace/live-refresh-controls";

type CompaniesListProps = {
  columns: CompanieColumn[];
  rows: CompanieRow[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  categoryNamesById?: Record<string, string>;
  activeCategory?: {
    id: number;
    categoria: string;
  } | null;
};

type FeedbackState = {
  tone: "success" | "error";
  message: string;
} | null;

type DraftState = Record<string, string>;

const EXPANDABLE_COLUMNS = new Set(["Giro"]);
const READONLY_COLUMNS = new Set(["id", "created_at"]);

function getEditableColumns(columns: CompanieColumn[]) {
  return columns.filter((column) => !READONLY_COLUMNS.has(column.key));
}

function buildPageHref(page: number, categoryId?: number | null) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));

  if (categoryId) {
    searchParams.set("category", String(categoryId));
  }

  return `/empresas?${searchParams.toString()}`;
}

function getColumnLabel(column: CompanieColumn, mode: "table" | "form" = "table") {
  if (column.key === "categoriaempresa") {
    return mode === "table" ? "Categoria" : "Categoria (ID)";
  }

  return column.key;
}

function formatValue(
  value: unknown,
  column: CompanieColumn,
  categoryNamesById: Record<string, string> = {},
) {
  if (value === null || value === undefined || value === "") {
    return "Sin dato";
  }

  if (column.key === "categoriaempresa") {
    const categoryKey = String(value);
    return categoryNamesById[categoryKey] ?? `Categoria ${categoryKey}`;
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("es-MX").format(value);
  }

  if (typeof value === "boolean") {
    return value ? "Si" : "No";
  }

  if (typeof value === "string") {
    if (column.format === "date") {
      const date = new Date(`${value}T00:00:00`);

      if (!Number.isNaN(date.getTime())) {
        return new Intl.DateTimeFormat("es-MX", {
          dateStyle: "medium",
        }).format(date);
      }
    }

    if (column.format === "timestamp with time zone") {
      const date = new Date(value);

      if (!Number.isNaN(date.getTime())) {
        return new Intl.DateTimeFormat("es-MX", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(date);
      }
    }

    return value.replace(/\s+/g, " ").trim();
  }

  return String(value);
}

function getInputValue(value: unknown, column: CompanieColumn) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    if (column.format === "timestamp with time zone") {
      return value.slice(0, 16);
    }

    return value;
  }

  return String(value);
}

function getCompanyId(row: CompanieRow) {
  const rawId = row.id;

  if (typeof rawId === "number") {
    return rawId;
  }

  return Number(rawId);
}

function createDraft(row: CompanieRow, columns: CompanieColumn[]) {
  const draft: DraftState = {};

  for (const column of getEditableColumns(columns)) {
    draft[column.key] = getInputValue(row[column.key], column);
  }

  return draft;
}

function isTextareaColumn(column: CompanieColumn) {
  return column.key === "Giro";
}

function getInputType(column: CompanieColumn) {
  if (column.format === "date") {
    return "date";
  }

  if (column.key === "Correo") {
    return "email";
  }

  if (column.key === "Sitio web") {
    return "url";
  }

  return "text";
}

export function CompaniesList({
  columns,
  rows,
  currentPage,
  pageSize,
  totalPages,
  totalCount,
  categoryNamesById = {},
  activeCategory = null,
}: CompaniesListProps) {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftState>({});
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [pendingAction, startTransition] = useTransition();

  const firstItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = totalCount === 0 ? 0 : firstItem + rows.length - 1;
  const editableColumns = getEditableColumns(columns);
  const editingCompany =
    editingCompanyId === null
      ? null
      : rows.find((row) => getCompanyId(row) === editingCompanyId) ?? null;

  function toggleEditMode() {
    setIsEditMode((current) => {
      const next = !current;

      if (!next) {
        setEditingCompanyId(null);
        setDraft({});
        setFeedback(null);
      }

      return next;
    });
  }

  function handleEditRow(row: CompanieRow) {
    const companyId = getCompanyId(row);

    setEditingCompanyId(companyId);
    setDraft(createDraft(row, columns));
    setFeedback(null);
  }

  function handleDraftChange(
    columnKey: string,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const nextValue = event.target.value;

    setDraft((current) => ({
      ...current,
      [columnKey]: nextValue,
    }));
  }

  function cancelEdit() {
    setEditingCompanyId(null);
    setDraft({});
    setFeedback(null);
  }

  function refreshCompanies() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function saveCompany() {
    if (editingCompanyId === null) {
      return;
    }

    setFeedback(null);
    setIsMutating(true);

    try {
      const response = await fetch(`/api/companies/${editingCompanyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: draft,
        }),
      });

      const result = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "No se pudo guardar la empresa.");
      }

      setFeedback({
        tone: "success",
        message: "La empresa se actualizo correctamente en Supabase.",
      });
      setEditingCompanyId(null);
      setDraft({});
      refreshCompanies();
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "No se pudo guardar la empresa.",
      });
    } finally {
      setIsMutating(false);
    }
  }

  async function removeCompany(companyId: number) {
    const confirmed = window.confirm(
      `Se borrara la empresa ${companyId} de Supabase. Esta accion no se puede deshacer. Deseas continuar?`,
    );

    if (!confirmed) {
      return;
    }

    setFeedback(null);
    setIsMutating(true);

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "No se pudo borrar la empresa.");
      }

      if (editingCompanyId === companyId) {
        setEditingCompanyId(null);
        setDraft({});
      }

      setFeedback({
        tone: "success",
        message: "La empresa se borro correctamente en Supabase.",
      });
      refreshCompanies();
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "No se pudo borrar la empresa.",
      });
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <section className="section-card companies-shell">
      <div className="companies-toolbar">
        <div className="section-head">
          <span className="section-kicker">Supabase conectado</span>
          <h1 className="section-title companies-title">Empresas</h1>
          <p className="section-description">
            Tabla enlazada a <code>companie</code> y mostrando todas sus columnas reales.
          </p>
        </div>

        <div className="companies-toolbar-side">
          <CompaniesViewTabs activeView="todas" />
          <div className="companies-toolbar-actions">
            <LiveRefreshControls
              pauseAutoRefresh={isEditMode || isMutating}
              disabled={isMutating}
            />
            <button
              className="primary-button companies-edit-button"
              type="button"
              disabled={pendingAction || isMutating}
              onClick={toggleEditMode}
            >
              {isEditMode ? "Cerrar edicion" : "Editar"}
            </button>
            <div className="companies-summary">
              Mostrando {firstItem}-{lastItem} de {totalCount} registros
            </div>
          </div>
        </div>
      </div>

      {activeCategory ? (
        <div className="companies-filter-banner">
          <div>
            <strong>Categoria activa:</strong> {activeCategory.categoria}
          </div>
          <Link className="secondary-button company-clear-filter" href="/empresas">
            Ver todas
          </Link>
        </div>
      ) : null}

      {isEditMode ? (
        <div className="companies-admin-note">
          Selecciona una empresa para editarla o borrarla. Los cambios se guardan directamente en Supabase.
        </div>
      ) : null}

      {isEditMode && editingCompany ? (
        <section className="company-form-card">
          <div className="section-head">
            <span className="section-kicker">Edicion activa</span>
            <h2 className="section-title">Editando empresa #{editingCompanyId}</h2>
            <p className="section-description">
              Puedes actualizar los datos visibles de la empresa y guardar los cambios en Supabase.
            </p>
          </div>

          <div className="company-form-grid">
            {editableColumns.map((column) => (
              <label
                className={`field-stack${isTextareaColumn(column) ? " is-full" : ""}`}
                key={column.key}
              >
                <span className="field-label">
                  {getColumnLabel(column, "form")}
                  {column.required ? " *" : ""}
                </span>
                {isTextareaColumn(column) ? (
                  <textarea
                    className="field-input field-textarea"
                    rows={6}
                    value={draft[column.key] ?? ""}
                    onChange={(event) => handleDraftChange(column.key, event)}
                  />
                ) : (
                  <input
                    className="field-input"
                    type={getInputType(column)}
                    value={draft[column.key] ?? ""}
                    onChange={(event) => handleDraftChange(column.key, event)}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="company-form-actions">
            <button
              className="primary-button company-action-button"
              type="button"
              disabled={pendingAction || isMutating}
              onClick={saveCompany}
            >
              Guardar cambios
            </button>
            <button
              className="secondary-button company-action-button"
              type="button"
              disabled={pendingAction || isMutating}
              onClick={cancelEdit}
            >
              Cancelar
            </button>
          </div>
        </section>
      ) : null}

      {feedback ? <div className={`companies-feedback ${feedback.tone}`}>{feedback.message}</div> : null}

      <div className="companies-table-wrap">
        <table className="companies-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  <div className="company-head-cell">
                    <span>{getColumnLabel(column)}</span>
                    <span className="company-head-meta">
                      {column.type}
                      {column.required ? " | requerido" : ""}
                    </span>
                  </div>
                </th>
              ))}
              {isEditMode ? <th className="company-actions-head">Acciones</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="companies-empty" colSpan={Math.max(columns.length + (isEditMode ? 1 : 0), 1)}>
                  No hay empresas para mostrar en esta pagina.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={String(row.id ?? `${currentPage}-${index}`)}>
                  {columns.map((column) => {
                    const formattedValue = String(
                      formatValue(row[column.key], column, categoryNamesById),
                    );
                    const isExpandable =
                      EXPANDABLE_COLUMNS.has(column.key) &&
                      formattedValue !== "Sin dato";

                    return (
                      <td key={`${String(row.id ?? index)}-${column.key}`}>
                        {isExpandable ? (
                          <ExpandableTextModal
                            label={getColumnLabel(column)}
                            previewLength={80}
                            value={formattedValue}
                          />
                        ) : (
                          <div
                            className={`company-data${formattedValue.length > 80 ? " is-long" : ""}`}
                            title={formattedValue}
                          >
                            {formattedValue}
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {isEditMode ? (
                    <td className="company-actions-cell">
                      <div className="company-actions">
                        <button
                          className="secondary-button company-action-button"
                          type="button"
                          disabled={pendingAction || isMutating}
                          onClick={() => handleEditRow(row)}
                        >
                          Editar fila
                        </button>
                        <button
                          className="danger-button company-action-button"
                          type="button"
                          disabled={pendingAction || isMutating || !Number.isFinite(getCompanyId(row))}
                          onClick={() => removeCompany(getCompanyId(row))}
                        >
                          Borrar
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-bar">
        {currentPage > 1 ? (
          <Link
            className="secondary-button pagination-button"
            href={buildPageHref(currentPage - 1, activeCategory?.id ?? null)}
          >
            Anterior
          </Link>
        ) : (
          <span className="secondary-button pagination-button is-disabled">Anterior</span>
        )}

        <div className="pagination-pages" aria-label="Paginas de empresas">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Link
              key={pageNumber}
              className={`pagination-page${pageNumber === currentPage ? " is-active" : ""}`}
              href={buildPageHref(pageNumber, activeCategory?.id ?? null)}
            >
              {pageNumber}
            </Link>
          ))}
        </div>

        {currentPage < totalPages ? (
          <Link
            className="secondary-button pagination-button"
            href={buildPageHref(currentPage + 1, activeCategory?.id ?? null)}
          >
            Siguiente
          </Link>
        ) : (
          <span className="secondary-button pagination-button is-disabled">Siguiente</span>
        )}
      </div>
    </section>
  );
}
