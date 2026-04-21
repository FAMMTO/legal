import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: string;
};

export function SectionCard({
  title,
  description,
  children,
  footer,
}: SectionCardProps) {
  return (
    <section className="section-card">
      <div className="section-head">
        <h2 className="section-title">{title}</h2>
        <p className="section-description">{description}</p>
      </div>
      {children}
      {footer ? <div className="footer-note">{footer}</div> : null}
    </section>
  );
}
