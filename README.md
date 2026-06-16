# rmoddel.com

Responsive Next.js marketing site for Reuben Moddel.

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Custom CSS in `app/globals.css`

## Features

- One-page marketing site aligned to the current "Turn Rough Ideas Into Polished Results" positioning
- Responsive layout for desktop and mobile
- Contact form with client-side submission state
- Server-side `/api/contact` route
- Email delivery through the existing external mail relay

## Project Structure

```text
app/
  api/contact/route.ts   Contact form API route
  globals.css            Site styling
  layout.tsx             Root layout + metadata
  page.tsx               Homepage content
components/
  contact-form.tsx       Interactive contact form
lib/
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
```

Notes:

- `EMAIL_API_URL` should point to the existing relay endpoint, such as `/api/send`
- `EMAIL_API_SECRET` stays server-side and should not be exposed as a public browser env var
- `EMAIL_FROM` must match a sender recognized by the relay
- `CONTACT_TO` is the inbox that should receive website inquiries

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
2. The form posts JSON to `app/api/contact/route.ts`
3. The route validates required fields and email format
4. The route formats the message using `lib/contact-email.ts`
5. The route sends the message through the configured relay

## Current Status

- Homepage implemented
- Contact form implemented
- Relay-backed email sending implemented
- Local production build verified

## Next Content Tasks

- Add real screenshots or cropped work samples
- Replace proof placeholders with real testimonials or examples
- Add favicon, OG image, and final brand assets
