import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import {
  dashboardChecklist,
  dashboardSections,
  dashboardStats,
} from "@/lib/legal-data";

export default function DashboardPage() {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="hero-content">
          <span className="section-kicker">Operacion legal centralizada</span>
          <h1 className="hero-title">Panel de control</h1>
          <p className="hero-description">
            Vista ejecutiva para entender carga operativa, prioridades y eventos que despues alimentaremos
            con Supabase y flujos de automatizacion en n8n.
          </p>
        </div>

        <div className="hero-highlight">
          <span className="section-kicker">Direccion de producto</span>
          <p>
            Este panel ya esta listo para convertirse en el punto de entrada del equipo: metricas, alertas y
            accesos a cada modulo del sistema.
          </p>
        </div>
      </section>

      <div className="metric-grid">
        {dashboardStats.map((stat) => (
          <MetricCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="section-grid">
        <div className="split-list">
          {dashboardSections.map((section) => (
            <SectionCard
              key={section.title}
              title={section.title}
              description={section.description}
            >
              <div className="feed-list">
                {section.items.map((item) => (
                  <article className="feed-item" key={`${section.title}-${item.title}`}>
                    <div className="feed-head">
                      <div>
                        <h3 className="feed-title">{item.title}</h3>
                        <p className="feed-copy">{item.description}</p>
                      </div>
                      <span className={`pill ${item.tone ?? "neutral"}`}>{item.statusLabel}</span>
                    </div>
                    <span className="feed-meta">{item.meta}</span>
                  </article>
                ))}
              </div>
            </SectionCard>
          ))}
        </div>

        <div className="split-list">
          <SectionCard
            title="Foco del siguiente sprint"
            description="Pasos que convierten esta UI en un sistema operativo real."
          >
            <div className="checklist">
              {dashboardChecklist.map((item) => (
                <article className="check-item" key={item.title}>
                  <div className="check-head">
                    <h3 className="check-title">{item.title}</h3>
                    <span className="pill accent">Prioridad</span>
                  </div>
                  <p className="list-description">{item.description}</p>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Bloques listos para integracion"
            description="Cada parte del panel ya tiene un destino claro en la arquitectura futura."
            footer="Siguiente paso: reemplazar datos mock por consultas server-side y politicas RLS."
          >
            <div className="integration-list">
              <div className="integration-item">Metricas alimentadas por vistas y consultas en Supabase.</div>
              <div className="integration-item">Alertas disparadas desde n8n y edge functions.</div>
              <div className="integration-item">Permisos por rol para mostrar solo informacion relevante.</div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
