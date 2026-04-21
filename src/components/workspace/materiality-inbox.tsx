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
            Vista conectada a <code>tabla_de_n8n</code>, mostrando los campos{" "}
            <code>correo_peticion</code>, <code>contexto</code> y <code>correo_id</code>.
          </p>
        </div>

        <div className="companies-summary">
          {loadError ? "Sin lectura" : `${messages.length} registros de materialidad`}
        </div>
      </div>

      {loadError ? <div className="companies-feedback error">{loadError}</div> : null}

      {!loadError ? (
        <div className="companies-admin-note">
          Modo simplificado activo: el webhook de n8n ahora guarda directo en{" "}
          <code>tabla_de_n8n</code> y esta pantalla refleja esos registros sin usar el mock
          anterior.
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
                  <span className="section-kicker">Registro #{message.id}</span>
                  <h2 className="materiality-item-title">
                    {renderValue(message.correoId, "Correo ID sin capturar")}
                  </h2>
                </div>

                <span className="pill accent">tabla_de_n8n</span>
              </div>

              <div className="materiality-message-body">
                {renderValue(message.contexto, "Sin contexto recibido")}
              </div>

              <div className="materiality-meta-grid">
                <div className="materiality-meta-card">
                  <span className="materiality-meta-label">Correo ID</span>
                  <span className="materiality-meta-value">
                    {renderValue(message.correoId)}
                  </span>
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
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
