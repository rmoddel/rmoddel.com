---
status: awaiting_human_verify
trigger: "Debug why the production contact form says validation passes but the external email server is not getting hit. Work read-only unless you find a clear minimal patch; if you patch, only touch contact/email submission files and list exact changes. Focus files: app/api/contact/route.ts, components/contact-form.tsx, components/interactive-resume.tsx, lib/contact-email.ts, lib/security/verify-turnstile.ts, lib/security/contact-rate-limit.ts, .env.example, docs if relevant. Trace every early return after honeypot/Turnstile validation and before the outbound EMAIL_API_URL fetch. Identify the exact condition(s) that can cause ok/success without calling the email server, especially after recent honeypot/completion-time changes. Do not revert unrelated changes. Return a concise root cause report with evidence and a proposed/implemented fix."
created: 2026-07-28T14:01:44Z
updated: 2026-07-28T14:29:54Z
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: "Production is likely running a stale/mixed contact bundle where the completion-time or honeypot branch returns ok:true before sendContactMessage and the client treats ok:true as sent."
test: "Compare current response contract against historical commit 658353b where symptom is directly reproducible; verify current build; ask user to verify production deploy/cache."
expecting: "Production should stop showing success without a relay hit once it serves code requiring sent:true and no longer discards completion_time as success."
next_action: "Verify production is deployed from current code and browser/CDN cache is not serving pre-e1d2fb client assets."

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: "Production contact form should call the external email server via EMAIL_API_URL after honeypot and Turnstile validation pass."
actual: "Production contact form says validation passes, but the external email server is not getting hit."
errors: "No explicit error provided; observable symptom is ok/success before outbound EMAIL_API_URL fetch."
reproduction: "Submit the production contact form with recent honeypot/completion-time fields in play."
started: "Likely after recent honeypot/completion-time changes."

## Eliminated
<!-- APPEND only - prevents re-investigating -->

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-07-28T14:01:44Z
  checked: "Required common bug patterns"
  found: "Symptom maps primarily to Environment/Config, Error Handling, and Data Shape/API Contract; user specifically constrains the search to early returns after honeypot/Turnstile validation before EMAIL_API_URL fetch."
  implication: "Prioritize explicit branch tracing and success-response contract mismatches over broad speculation."
- timestamp: 2026-07-28T14:08:12Z
  checked: "app/api/contact/route.ts"
  found: "POST return path: honeypot returns contactJson({ ok: true, sent: false }) before rate limit/Turnstile; missing token and failed Turnstile return ok:false; after Turnstile success, reportCompletionTiming only warns; payload validation returns ok:false; email success-rate limit returns ok:false/429; only then sendContactMessage calls fetch(EMAIL_API_URL); final success is { ok: true, sent: true }."
  implication: "After Turnstile validation, there is no ok:true server return before EMAIL_API_URL in the focused route. The only server-side ok:true/no-email branch is honeypot silent discard, and it includes sent:false."
- timestamp: 2026-07-28T14:08:12Z
  checked: "components/contact-form.tsx and components/interactive-resume.tsx"
  found: "Both focused UI callers require response.ok, data.ok, and data.sent === true before showing success."
  implication: "The focused page and interactive resume should not display success for route.ts silentDiscard; another caller or production code mismatch may be involved."
- timestamp: 2026-07-28T14:13:06Z
  checked: "components/ai-widget.tsx"
  found: "The assistant widget posts JSON to /api/contact without cf-turnstile-response/turnstileToken, honeypot, or startedAt fields. The current route returns ok:false/BOT_TOKEN_MISSING before Turnstile for that caller."
  implication: "Assistant email flow is incompatible with the new Turnstile requirement, but this does not produce ok/success and does not match the requested post-validation/no-email success condition."
- timestamp: 2026-07-28T14:13:06Z
  checked: "components/turnstile.tsx and lib/security/turnstile-config.ts"
  found: "Turnstile widgets submit field cf-turnstile-response and action turnstile-spin-v2; server expects the same action."
  implication: "Focused contact and interactive resume forms provide the expected token field when Turnstile is solved."
- timestamp: 2026-07-28T14:13:06Z
  checked: "docs/assistant-deployment.md and git status/diff"
  found: "Docs state contact email vars are captured during next build and production needs EMAIL_API_URL/SECRET/FROM/TO plus Turnstile and Upstash vars. Worktree already has an unrelated .env.example change adding Turnstile keys; only .planning debug file has been added by this session."
  implication: "Missing/incorrect production env can prevent fetch, but route would return an error response, not ok/success."
- timestamp: 2026-07-28T14:20:27Z
  checked: "git show 658353b route and clients"
  found: "At 658353b, route.ts returned contactJson({ ok: true }) for honeypot before sendContactMessage, and also after Turnstile when startedAt was missing/invalid or elapsed < 2000ms; focused clients checked only !response.ok || !data.ok, so ok:true displayed success without fetch(EMAIL_API_URL)."
  implication: "This exactly explains validation-pass/success with no external email server hit when production or cached browser assets use that version/contract."
- timestamp: 2026-07-28T14:20:27Z
  checked: "git show e1d2fb5 and HEAD"
  found: "e1d2fb5 changed successful sends to { ok:true, sent:true } and clients to require sent:true; it also changed silent discards to { ok:true, sent:false }. HEAD/79c043f removed completion-time as a discard entirely and now only logs fast/missing timing after Turnstile verification."
  implication: "Current HEAD contains the minimal intended fix for the reported success-without-email condition; production likely needs redeploy/cache validation rather than a new code patch in focused files."
- timestamp: 2026-07-28T14:29:54Z
  checked: "npm run build"
  found: "Next production build completed successfully."
  implication: "Current source state compiles; no build-time TypeScript issue blocks deploying the fixed response contract."
- timestamp: 2026-07-28T14:29:54Z
  checked: "final git diff/status"
  found: "Worktree contains source changes in .env.example, app/api/contact/route.ts, components/contact-form.tsx, components/interactive-resume.tsx, and lib/security/verify-turnstile.ts that were not made by this debugger via apply_patch. They add contact-stage logging, rename the honeypot field to contactPreference while accepting old names, add Turnstile allowed hostname config, and update env examples."
  implication: "Do not revert; report them separately from debugger-created files. Debugger-created source patch: none."

## Resolution
<!-- OVERWRITE as understanding evolves -->

root_cause: "A stale/mixed production contact bundle can report success without hitting EMAIL_API_URL because commit 658353b returned { ok:true } for honeypot and for missing/invalid/fast startedAt after Turnstile, while clients accepted ok:true without requiring sent:true."
fix: "Deploy code at/after e1d2fb5/79c043f: route returns sent:true only after sendContactMessage and current clients require data.sent === true. Current working tree also contains uncommitted contact-path hardening/observability changes not authored by this debugger."
verification: "Static branch trace; git history comparison; npm run build passed on current source state."
files_changed: [".planning/debug/contact-email-server-not-hit.md"]
