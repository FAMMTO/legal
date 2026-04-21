import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://legal-workflow.local"),
  title: {
    default: "Legal Workflow",
    template: "%s | Legal Workflow",
  },
  description:
    "Frontend base para la operacion legal, listo para integracion posterior con Supabase, n8n y despliegue en Vercel.",
  applicationName: "Legal Workflow",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
