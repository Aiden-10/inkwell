
# Security Threat Model

## Attack Surface

- `POST /api/auth/register` — Unauthenticated, accepts email/displayName/password
- `POST /api/auth/login` — Unauthenticated, accepts email/password
- `POST /api/posts` — Authenticated, accepts title/body/tags
- `GET /api/posts` — Unauthenticated, returns paginated feed
- JWT access tokens — Bearer tokens sent in the Authorization header

## STRIDE Analysis, with Risk Rating

| Component | Threat | Category | Likelihood | Impact | Risk Rating | Mitigation |
|---|---|---|---|---|---|---|
| POST /api/posts | A user forges another user's `authorId` to publish as them | Spoofing | High | High | Critical | Derive author from the authenticated token, never trust client-supplied authorId (Section 5.2) |
| GET /api/posts | Response includes fields beyond what the feed needs (e.g., email) | Information Disclosure | High | Medium | High | Explicit response shaping / DTO (Section 5.3) |
| POST /api/auth/login | Unlimited login attempts enable brute-force credential guessing | Denial of Service / Broken Auth | Medium | High | High | Rate limiting (Section 5.4) |
| POST /api/posts | Untrusted `body` content rendered unsanitized on the client, enabling stored XSS | Tampering / Information Disclosure | Medium | High | High | Output encoding on render (Section 5.5) |


### Hardening Log

- 2026 — Lecture 15: Fixed `authorId` spoofing vulnerability (Section 1.3)
- 2026 — Lecture 15: Added allowlist-based user DTO to prevent sensitive field leakage (Section 1.4)
- 2026 — Lecture 15: Added rate limiting to authentication endpoints (Section 1.5)
- 2026 — Lecture 15: Verified stored-XSS resistance with a regression test (Section 1.6)

### Security Measurement Baseline

- **Vulnerabilities identified:** 4 (mitigations implemented)
- **Security test coverage:** 1 of 4 attack-surface endpoints has a dedicated security regression test
- **Security maturity:** Ad hoc/reactive — a single hardening pass rather than an established, continuous security program
- **Future improvements:** Expand security regression tests, automate security checks, and regularly review the threat model
