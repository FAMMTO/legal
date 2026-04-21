import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="auth-screen">
      <section className="auth-visual">
        <div className="auth-kicker">
          <span className="auth-kicker-mark">LW</span>
          Legal ops UI foundation
        </div>

        <div>
          <h1 className="auth-title">Control legal claro, ordenado y listo para escalar.</h1>
          <p className="auth-description">
            Estamos construyendo la base del sistema para el area legal con una interfaz intuitiva,
            preparada para integracion posterior con Supabase, n8n y despliegue en Vercel.
          </p>
        </div>

        <div className="auth-grid">
          <article className="signal-card">
            <span className="signal-value">01</span>
            <strong>Login demo</strong>
            <p className="muted-copy">Flujo visual listo para recibir autenticacion real en el siguiente sprint.</p>
          </article>
          <article className="signal-card">
            <span className="signal-value">06</span>
            <strong>Modulos iniciales</strong>
            <p className="muted-copy">Panel, empresas, clientes, materialidad, notificaciones y perfil.</p>
          </article>
        </div>
      </section>

      <section className="auth-panel">
        <div className="panel-copy">
          <span className="section-kicker">Acceso inicial</span>
          <h2 className="panel-title">Entrar al workspace legal</h2>
          <p className="page-description">
            Esta fase es solo frontend. El objetivo es dejar la experiencia, la navegacion y la estructura
            listas para conectar autenticacion, base de datos y automatizaciones despues.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
