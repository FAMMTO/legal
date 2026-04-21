"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { navigationItems } from "@/lib/legal-data";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-row">
            <span className="brand-mark">LW</span>
            <div>
              <h1 className="brand-title">Legal Workflow</h1>
              <p className="brand-caption">UI base para operacion legal en Vercel</p>
            </div>
          </div>
          <p className="muted-copy">
            Navegacion lista para crecer con autenticacion, RLS y automatizaciones de n8n.
          </p>
        </div>

        <nav className="nav-list" aria-label="Navegacion principal">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                className={`nav-link${isActive ? " is-active" : ""}`}
                href={item.href}
              >
                <span className="nav-link-mark">{item.icon}</span>
                <span className="nav-text">
                  <span className="nav-title">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </span>
                <span className="nav-arrow">/</span>
              </Link>
            );
          })}
        </nav>

        <div className="section-card">
          <div className="section-head">
            <span className="section-kicker">Stack planeado</span>
            <h2 className="section-title">Supabase + n8n + Vercel</h2>
            <p className="section-description">
              La arquitectura ya separa UI, layout y datos mock para que la siguiente iteracion solo conecte servicios.
            </p>
          </div>
          <div className="integration-list">
            <div className="integration-item">Auth y perfiles en Supabase</div>
            <div className="integration-item">RLS por modulo y rol</div>
            <div className="integration-item">Eventos y recordatorios con n8n</div>
          </div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-copy">
            <span className="section-kicker">Workspace legal</span>
            <h2 className="topbar-title">Centro de operaciones</h2>
            <p className="topbar-meta">
              Entorno demo listo para navegar modulos, validar experiencia y preparar la
              siguiente integracion con Supabase y n8n.
            </p>
          </div>
          <div className="topbar-actions">
            <div className="search-shell">Modo demo activo</div>
            <span className="profile-badge">CT</span>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
