import { ModuleDefinition, Tone } from "@/lib/legal-data";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";

type ModulePageProps = {
  module: ModuleDefinition;
};

function toneClass(tone?: Tone) {
  return tone ?? "neutral";
}

export function ModulePage({ module }: ModulePageProps) {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="hero-content">
          <span className="section-kicker">{module.eyebrow}</span>
          <h1 className="hero-title">{module.label}</h1>
          <p className="hero-description">{module.summary}</p>
        </div>

        <div className="hero-highlight">
          <span className="section-kicker">Objetivo del modulo</span>
          <p>{module.highlight}</p>
        </div>
      </section>

      <div className="metric-grid">
        {module.stats.map((stat) => (
          <MetricCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="section-grid">
        <div className="split-list">
          {module.sections.map((section) => (
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
                      <span className={`pill ${toneClass(item.tone)}`}>{item.statusLabel}</span>
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
            title="Checklist de producto"
            description="Prioridades para cuando conectemos logica, datos y automatizaciones."
          >
            <div className="checklist">
              {module.checklist.map((item) => (
                <article className="check-item" key={item.title}>
                  <div className="check-head">
                    <h3 className="check-title">{item.title}</h3>
                    <span className="pill neutral">Base UI</span>
                  </div>
                  <p className="list-description">{item.description}</p>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Proxima integracion"
            description="Mapa de lo que sigue para conectar este modulo de forma real."
            footer="La capa visual ya esta separada de la capa de datos para facilitar esa integracion."
          >
            <div className="integration-list">
              {module.nextIntegration.map((item) => (
                <div className="integration-item" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
