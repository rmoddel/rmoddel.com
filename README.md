# rmoddel.com

Responsive Next.js personal portfolio site for Reuben Moddel.

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Custom CSS in `app/globals.css`

## Features

- One-page portfolio/about site aligned to business operations, people leadership, process improvement, stakeholder alignment, and organized execution
- Master narrative content in `content/site-profile.md`, consumed by homepage content, resume positioning, metadata, and assistant knowledge
- Responsive layout for desktop and mobile
- Contact form with client-side submission state
- Server-side `/api/contact` route
- Email delivery through the existing external mail relay
- Branded virtual assistant widget with local LLM support and site-knowledge fallback

## Project Structure

```text
app/
  api/assistant/route.ts Local assistant API route
  api/assistant/health/route.ts Assistant health route
  api/contact/route.ts   Contact form API route
  globals.css            Site styling
  layout.tsx             Root layout + metadata
  page.tsx               Homepage content
components/
  ai-widget.tsx          Virtual assistant widget
  contact-form.tsx       Interactive contact form
lib/
  assistant.ts           Assistant prompt + fallback logic
content/
  site-profile.md        Master site narrative and structured section copy
  contact-email.ts       Contact email subject/body generation
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create local env:

```bash
cp .env.example .env.local
```

3. Start the dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000` or `http://127.0.0.1:3000`

## Environment Variables

The contact form posts to the app's own API route, and the server route calls the external relay using these variables:

```bash
EMAIL_API_URL=
EMAIL_API_SECRET=
EMAIL_FROM=
CONTACT_TO=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
OLLAMA_BASE_URL=
OLLAMA_MODEL=
```

Notes:

- `EMAIL_API_URL` should point to the existing relay endpoint, such as `/api/send`
- `EMAIL_API_SECRET` stays server-side and should not be exposed as a public browser env var
- `EMAIL_FROM` must match a sender recognized by the relay
- `CONTACT_TO` is the inbox that should receive website inquiries
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is the public Cloudflare Turnstile site key. Production uses the existing `rmoddel-contact` widget: `0x4AAAAAAD_YHJOD4zhGoAs1`
- `TURNSTILE_SECRET_KEY` stays server-side and is used by `/api/contact` for Siteverify
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` enable persistent contact rate limiting
- `ASSISTANT_PROVIDER` selects the assistant backend: `ollama` for local development or `bedrock` for Amplify production
- `OLLAMA_BASE_URL` points to a local Ollama instance if you want real local-model replies
- `OLLAMA_MODEL` is the local model tag to use for the assistant
- `BEDROCK_REGION` is the AWS Region to use for Amazon Bedrock
- `BEDROCK_MODEL_ID` is the Bedrock model identifier used when `ASSISTANT_PROVIDER=bedrock`

For local Turnstile testing, use Cloudflare's development keys:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

## Local Assistant

The floating assistant is branded plainly as `Reuben's Assistant`.

- The widget sends chat requests to `app/api/assistant/route.ts`
- Provider health can be checked via `app/api/assistant/health/route.ts`
- That route tries a same-machine Ollama model first
- If no local model is available, it falls back to deterministic answers from site content

Example local setup:

```bash
ollama serve
ollama pull llama3.2:3b
```

## Amplify Production With Bedrock

Use this env setup in Amplify:

```bash
EMAIL_API_URL=
EMAIL_API_SECRET=
EMAIL_FROM=
CONTACT_TO=
ASSISTANT_PROVIDER=bedrock
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
BEDROCK_REGION=us-east-1
```

Notes:

- The four `EMAIL_*` / `CONTACT_TO` values are required for `/api/contact` in production
- Contact email values are captured during `next build`; redeploy the branch after changing them in Amplify
- The assistant route switches providers from env only; no code change is needed between local and production
- For local development, keep `ASSISTANT_PROVIDER=ollama`
- In Amplify, the app needs an SSR Compute role with permission to call Bedrock runtime for the selected model
- Amplify reserves custom env var names with an `AWS_` prefix, so use `BEDROCK_REGION`

## Deployment Guide

For full step-by-step setup, see:

- [docs/assistant-deployment.md](/Users/rmoddel/code/rmo/rmoddel.com/docs/assistant-deployment.md:1)

## Build

```bash
npm run build
```

To run the production server locally after building:

```bash
npm run start
```

## Contact Flow

1. User submits the form in `components/contact-form.tsx`
2. The form posts `FormData` to `app/api/contact/route.ts`
3. The route discards honeypot and unrealistically fast submissions
4. The route rate-limits attempts and verifies Cloudflare Turnstile server-side
5. The route validates required fields and email format
6. The route formats the message using `lib/contact-email.ts`
7. The route sends the message through the configured relay

## Current Status

- Homepage implemented
- Contact form implemented
- Relay-backed email sending implemented
- Local production build verified

## Next Content Tasks

- Add real screenshots or cropped work samples
- Replace proof placeholders with real testimonials or examples
- Add favicon, OG image, and final brand assets
