"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@legal.local");
  const [password, setPassword] = useState("********");

  function enterWorkspace() {
    router.push("/panel-de-control");
  }

  return (
    <div className="login-form">
      <div className="field-stack">
        <label className="field-label" htmlFor="email">
          Correo corporativo
        </label>
        <input
          id="email"
          className="field-input"
          type="text"
          placeholder="nombre@empresa.com"
          autoComplete="off"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="field-stack">
        <label className="field-label" htmlFor="password">
          Clave de acceso
        </label>
        <input
          id="password"
          className="field-input"
          type="text"
          placeholder="Introduce tu clave"
          autoComplete="off"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="button-row">
        <button className="primary-button" type="button" onClick={enterWorkspace}>
          Entrar al workspace
        </button>
        <button className="secondary-button" type="button" onClick={enterWorkspace}>
          Continuar con acceso demo
        </button>
      </div>

      <p className="button-helper">
        Esta pantalla es solo frontend. Puedes usar cualquier correo y cualquier clave para entrar al demo visual.
      </p>
    </div>
  );
}
