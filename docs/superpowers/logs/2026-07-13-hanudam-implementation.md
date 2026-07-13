# Hanudam Implementation Log — 2026-07-13

## Task 1 — Testable project foundation

- Pencil checkpoint: `QUALITY · 오류·측정·테스트` updated to `TEST & RELEASE`; layout validation returned `No layout problems.`
- Baseline: `npm.cmd run lint` passed. Sandboxed build failed only on Google Fonts network access; the approved unsandboxed `npm.cmd run build` passed.
- Dependency resolution: pinned `@vitejs/plugin-react@5.2.0` because v6 required the Babel 8 path while Sanity uses Babel 7. Official npm metadata confirmed v5.2 supports Vite 8 with Babel 7.
- RED: `npx.cmd vitest run tests/unit/project-baseline.test.ts` failed because the `@` alias was unresolved.
- GREEN: `npm.cmd test -- tests/unit/project-baseline.test.ts` passed 1/1; `npm.cmd run lint` exited 0.
- Changed files: `package.json`, `package-lock.json`, `.gitignore`, `vitest.config.ts`, `playwright.config.ts`, `tests/setup.ts`, `tests/unit/project-baseline.test.ts`.
- Git: work is on `codex/hanudam-site`; no commit created.

## Task 2 — Content contracts and safe fallback

- Pencil checkpoint: admin status changed to `안전 폴백 준비`; layout validation returned `No layout problems.`
- RED: `npm.cmd test -- tests/unit/content-repository.test.ts` failed because `lib/site/content.ts` did not exist.
- GREEN: the focused test passed 2/2; `npm.cmd run lint` exited 0; approved unsandboxed `npm.cmd run build` compiled and type-checked successfully.
- Safety: verified address and Naver link are present; phone, business hours, parking, prices, notices, and testimonials remain empty until authoritative values exist.
- Changed files: `lib/site/types.ts`, `lib/site/urls.ts`, `lib/site/fallback-content.ts`, `lib/site/content.ts`, `tests/unit/content-repository.test.ts`.
- Git: no commit created.
