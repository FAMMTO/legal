import type { MaterialityMessage } from "@/lib/materiality";

type MaterialityInboxProps = {
  messages: MaterialityMessage[];
  loadError?: string | null;
};

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
  return (
    <section className="section-card companies-shell materiality-shell">
      <div className="companies-toolbar">
        <div className="section-head">
          <span className="section-kicker">Bandeja n8n activa</span>
          <h1 className="section-title companies-title">Materialidad</h1>
          <p className="section-description">
            Vista depurada: aqui solo aparecen mensajes del cliente recibidos con el evento{" "}
            <code>mensaje_del_cliente</code>.
          </p>
        </div>

        <div className="companies-summary">
          {loadError ? "Sin lectura" : `${messages.length} registros de materialidad`}
        </div>
      </div>

      {loadError ? <div className="companies-feedback error">{loadError}</div> : null}

      {!loadError ? (
        <div className="companies-admin-note">
          Modo simplificado activo: esta vista reemplaza el contenido mock anterior y solo
          muestra mensajes guardados desde el webhook de n8n.
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
          {messages.map((message) => (
            <article className="materiality-item" key={message.id}>
              <div className="materiality-item-head">
                <div className="materiality-item-copy">
                  <span className="section-kicker">{message.source}</span>
                  <h2 className="materiality-item-title">
                    {renderValue(message.nombre, "Mensaje del cliente")}
                  </h2>
                </div>

                <span className="pill accent">{message.event}</span>
              </div>

              <div className="materiality-message-body">{renderValue(message.mensaje)}</div>

              <div className="materiality-meta-grid">
                <div className="materiality-meta-card">
                  <span className="materiality-meta-label">Correo</span>
                  <span className="materiality-meta-value">{renderValue(message.correo)}</span>
                </div>

                <div className="materiality-meta-card">
                  <span className="materiality-meta-label">Empresa del servicio</span>
                  <span className="materiality-meta-value">
                    {renderValue(message.empresaDelServicio)}
                  </span>
                </div>

                <div className="materiality-meta-card">
                  <span className="materiality-meta-label">Timestamp n8n</span>
                  <span className="materiality-meta-value">{formatDate(message.timestamp)}</span>
                </div>

                <div className="materiality-meta-card">
                  <span className="materiality-meta-label">Registrado en el sistema</span>
                  <span className="materiality-meta-value">{formatDate(message.createdAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
