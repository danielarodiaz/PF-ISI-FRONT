# PF-ISI-FRONT

[![Frontend CD](https://github.com/danielarodiaz/PF-ISI-FRONT/actions/workflows/frontend-cd.yml/badge.svg?branch=master)](https://github.com/danielarodiaz/PF-ISI-FRONT/actions/workflows/frontend-cd.yml)

Frontend de InfoTrack (React + Vite).

## Arquitectura rápida

- App SPA: React + Vite
- Build de producción: archivos estáticos en `dist/`
- Runtime en contenedor: Nginx (`nginx.conf`)
- Deploy: Coolify (imagen Docker publicada desde GitHub Actions)

## Estructura

- `src/`: aplicación React (pantallas, helpers, componentes)
- `public/`: assets públicos
- `Dockerfile`: build multi-stage + Nginx para servir SPA
- `nginx.conf`: configuración de servidor para rutas SPA
- `.github/workflows/frontend-cd.yml`: pipeline de build, push y deploy

## Levantar local

1. Copiar variables base:

```bash
cp .env.example .env
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar en desarrollo:

```bash
npm run dev
```

4. Build local:

```bash
npm run build
```

## Variables de entorno

El frontend usa variables `VITE_` (ver `.env.example`):

- `VITE_API_URL`: URL pública del backend .NET
- `VITE_CHATBOT_URL`: URL pública del chatbot API

Estas variables se inyectan en build:

- Local: desde `.env`
- CI/CD: desde GitHub Variables (`FRONTEND_VITE_API_URL`, `FRONTEND_VITE_CHATBOT_URL`)

## CI/CD y deploy

Workflow: `.github/workflows/frontend-cd.yml`

- Trigger: push a `master` (excluye cambios solo en `.md`)
- Build de imagen Docker con cache Buildx (`type=gha`)
- Push al registry privado (`REGISTRY_HOST` + credenciales)
- Trigger de deploy en Coolify (`COOLIFY_TOKEN` + `COOLIFY_FRONTEND_DEPLOY_URL`)

Secrets/Variables esperadas en GitHub:

- Secret: `REGISTRY_USERNAME`
- Secret: `REGISTRY_PASSWORD`
- Secret: `COOLIFY_TOKEN`
- Variable: `REGISTRY_HOST`
- Variable: `FRONTEND_IMAGE`
- Variable: `COOLIFY_FRONTEND_DEPLOY_URL`
- Variable: `FRONTEND_VITE_API_URL`
- Variable: `FRONTEND_VITE_CHATBOT_URL`

## Notas

- Si falta `VITE_API_URL` o `VITE_CHATBOT_URL`, la app muestra mensajes de servicio no configurado en los módulos correspondientes.
- El flujo de turnos públicos persiste referencia del turno en cliente para recuperación de sesión por `publicToken`.
