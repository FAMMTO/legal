# Legal Workflow UI

Base frontend para un sistema del area legal construido con Next.js App Router y TypeScript, pensado para desplegarse en Vercel y conectarse despues con Supabase y n8n.

## Modulos incluidos

- Login demo no funcional
- Panel de control
- Empresas
- Clientes
- Materialidad
- Notificaciones
- Perfil

## Arquitectura base

- `src/app`: rutas App Router, layouts y estilos globales
- `src/components`: componentes reutilizables de autenticacion, layout y vistas
- `src/lib`: configuracion de navegacion y datos mock para la UI

## Instalacion

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Como probarlo

1. Entra a `http://localhost:3000/login`.
2. Escribe cualquier correo y cualquier clave.
3. Pulsa `Entrar al workspace`.
4. Recorre los modulos desde la barra lateral.

## Siguiente fase sugerida

- Integrar Supabase Auth para sustituir el acceso demo.
- Crear tablas y politicas RLS para empresas, clientes, notificaciones y perfiles.
- Conectar n8n para intake automatico, recordatorios y tareas.
