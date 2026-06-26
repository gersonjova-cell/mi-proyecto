# AI Agent Demo — Pedidos de Playeras por Teléfono

Agente de IA que contesta llamadas telefónicas vía Twilio y toma pedidos de playeras usando Claude de Anthropic. Al confirmar el pedido, envía un correo con los detalles a `jv@proddigit.shop`.

## Flujo de la llamada

1. **Saludo** — El agente contesta y pide nombre y apellido
2. **Talla** — S, M, L o XL
3. **Color** — El color deseado
4. **Modelo** — Regular Fit / Slim Fit / Oversize / Boxy Fit / Loose Fit
5. **Punto de entrega** — Dirección o punto de pickup
6. **Contacto** — Teléfono o correo electrónico
7. **Confirmación** — Resume todos los datos y pide confirmación
   - **Sí** → Registra el pedido y envía correo a jv@proddigit.shop
   - **No** → Pregunta qué corregir y regresa a confirmación

## Requisitos

- Node.js 18+
- Cuenta de Twilio con un número de teléfono
- API Key de Anthropic
- Cuenta SMTP para envío de correos (Gmail, SendGrid, etc.)
- URL pública para los webhooks (ngrok en desarrollo)

## Instalación

```bash
npm install
cp .env.example .env
# Edita .env con tus credenciales
```

## Configuración

### 1. Variables de entorno

Copia `.env.example` a `.env` y completa:

| Variable | Descripción |
|---|---|
| `ANTHROPIC_API_KEY` | Tu API key de Anthropic |
| `TWILIO_ACCOUNT_SID` | Account SID de Twilio |
| `TWILIO_AUTH_TOKEN` | Auth Token de Twilio |
| `SMTP_HOST` | Servidor SMTP (ej. `smtp.gmail.com`) |
| `SMTP_PORT` | Puerto SMTP (587 para TLS) |
| `SMTP_USER` | Tu correo remitente |
| `SMTP_PASS` | Contraseña de app SMTP |
| `PORT` | Puerto del servidor (default: 3000) |

### 2. Configurar Twilio

En la consola de Twilio, selecciona tu número de teléfono y en **Voice Configuration**:

- **A call comes in** → Webhook → `https://tu-dominio.com/voice/incoming` (HTTP POST)

### 3. Exponer localmente con ngrok (desarrollo)

```bash
ngrok http 3000
# Usa la URL https de ngrok en Twilio
```

## Ejecución

```bash
# Producción
npm start

# Desarrollo con auto-reload
npm run dev
```

## Estructura del proyecto

```
src/
  server.js   — Servidor Express + webhooks de Twilio
  agent.js    — Lógica de conversación con Claude
  email.js    — Envío de correo al confirmar pedido
.env.example  — Plantilla de variables de entorno
```

## Correo de pedidos

Al confirmar un pedido se envía automáticamente un correo a **jv@proddigit.shop** con nombre, talla, color, modelo, punto de entrega y contacto del cliente.