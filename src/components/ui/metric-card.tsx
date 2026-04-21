import { Stat } from "@/lib/legal-data";

type MetricCardProps = {
  stat: Stat;
};

export function MetricCard({ stat }: MetricCardProps) {
  const toneClass = stat.tone ?? "neutral";

  return (
    <article className={`metric-card ${toneClass}`}>
      <span className="metric-label">{stat.label}</span>
      <strong className="metric-value">{stat.value}</strong>
      <span className="metric-hint">{stat.hint}</span>
    </article>
  );
}
