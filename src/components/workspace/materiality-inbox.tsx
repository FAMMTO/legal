"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { MaterialityMessage } from "@/lib/materiality";
import { LiveRefreshControls } from "@/components/workspace/live-refresh-controls";

type MaterialityInboxProps = {
  messages: MaterialityMessage[];
  loadError?: string | null;
};

type FeedbackState = {
  tone: "success" | "error";
  message: string;
} | null;

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return dateFormatter.format(parsed);
}

function renderValue(value: string, fallback = "Sin dato por ahora") {
  return value || fallback;
}

export function MaterialityInbox({ messages, loadError }: MaterialityInboxProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function refreshMateriality() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function approveRecord(materialityId: number) {
    setApprovingId(materialityId);
    setFeedback(null);

    try {
      const response = await fetch(`/api/materiality/${materialityId}/approve`, {
        method: "POST",
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "No se pudo aprobar el registro.");
      }

      setFeedback({
        tone: "success",
        message:
          result.message ??
          `El registro ${materialityId} se envio correctamente al webhook de aprobacion.`,
      });
      refreshMateriality();
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo aprobar el registro de materialidad.",
      });
    } finally {
      setApprovingId(null);
    }
  }

  return (
    <section className="section-card companies-shell materiality-shell">
      <div className="companies-toolbar">
        <div className="section-head">
          <span className="section-kicker">Bandeja n8n activa</span>
          <h1 className="section-title companies-title">Materialidad</h1>
          <p className="section-description">
            Vista conectada a <code>tabla_de_n8n</code>, mostrando los campos{" "}
            <code>correo_peticion</code>, <code>contexto</code>, <code>correo_id</code>,{" "}
            <code>account_id</code>, <code>conversation_id</code> e <code>inbox_id</code>.
          </p>
        </div>

        <div className="companies-toolbar-side">
          <div className="companies-toolbar-actions">
            <LiveRefreshControls pauseAutoRefresh={approvingId !== null} disabled={isPending} />
            <div className="companies-summary">
              {loadError ? "Sin lectura" : `${messages.length} registros de materialidad`}
            </div>
          </div>
        </div>
      </div>

      {loadError ? <div className="companies-feedback error">{loadError}</div> : null}
      {feedback ? <div className={`companies-feedback ${feedback.tone}`}>{feedback.message}</div> : null}

      {!loadError ? (
        <div className="companies-admin-note">
          Modo simplificado activo: el webhook de n8n ahora guarda directo en{" "}
          <code>tabla_de_n8n</code>, esta pantalla refleja esos registros sin usar el mock
          anterior y cada boton <strong>Aprobar</strong> envia el row completo al webhook
          externo.
        </div>
      ) : null}

      {!loadError && messages.length === 0 ? (
        <div className="materiality-empty">
          No hay eventos entrantes por ahora. En cuanto llegue un evento{" "}
          <code>mensaje_del_cliente</code>, aparecera aqui.
        </div>
      ) : null}

      {!loadError && messages.length > 0 ? (
        <div className="materiality-list">
          {messages.map((message) => {
            const isApproving = approvingId === message.id;

            return (
              <article className="materiality-item" key={message.id}>
                <div className="materiality-item-head">
                  <div className="materiality-item-copy">
                    <span className="section-kicker">Registro #{message.id}</span>
                    <h2 className="materiality-item-title">
                      {renderValue(message.correoId, "Correo ID sin capturar")}
                    </h2>
                  </div>

                  <div className="materiality-item-actions">
                    <span className="pill accent">tabla_de_n8n</span>
                    <button
                      className="primary-button company-action-button"
                      type="button"
                      disabled={isApproving || isPending}
                      onClick={() => approveRecord(message.id)}
                    >
                      {isApproving ? "Enviando..." : "Aprobar"}
                    </button>
                  </div>
                </div>

                <div className="materiality-message-body">
                  {renderValue(message.contexto, "Sin contexto recibido")}
                </div>

                <div className="materiality-meta-grid">
                  <div className="materiality-meta-card">
                    <span className="materiality-meta-label">Correo ID</span>
                    <span className="materiality-meta-value">{renderValue(message.correoId)}</span>
                  </div>

                  <div className="materiality-meta-card">
                    <span className="materiality-meta-label">Correo peticion</span>
                    <span className="materiality-meta-value">
                      {renderValue(message.correoPeticion)}
                    </span>
                  </div>

                  <div className="materiality-meta-card">
                    <span className="materiality-meta-label">Registrado en el sistema</span>
                    <span className="materiality-meta-value">{formatDate(message.createdAt)}</span>
                  </div>

                  <div className="materiality-meta-card">
                    <span className="materiality-meta-label">Account ID</span>
                    <span className="materiality-meta-value">{renderValue(message.accountId)}</span>
                  </div>

                  <div className="materiality-meta-card">
                    <span className="materiality-meta-label">Conversation ID</span>
                    <span className="materiality-meta-value">
                      {renderValue(message.conversationId)}
                    </span>
                  </div>

                  <div className="materiality-meta-card">
                    <span className="materiality-meta-label">Inbox ID</span>
                    <span className="materiality-meta-value">{renderValue(message.inboxId)}</span>
                  </div>

                  <div className="materiality-meta-card">
                    <span className="materiality-meta-label">PDF enlazado</span>
                    <span className="materiality-meta-value">
                      {message.urlDelPdf ? (
                        <a
                          className="materiality-link"
                          href={message.urlDelPdf}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Abrir PDF
                        </a>
                      ) : (
                        "Sin PDF enlazado"
                      )}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
