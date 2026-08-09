# Portfolio — İsa Bezeniroğlu

Bilingual portfolio site. React 18 and TypeScript on Vite, deployed on Vercel,
with a serverless contact endpoint and realtime visitor stats.

**Live:** [isabezeniroglu.com](https://isabezeniroglu.com/)

|             |                                                                   |
| ----------- | ----------------------------------------------------------------- |
| Main bundle | ~68 kB gzip (the Contact route adds 19 kB for Zod and Turnstile)  |
| Images      | 233 KB total, generated from 3.73 MB of sources                   |
| Lighthouse  | 100 performance · 100 accessibility · 96 best practices · 100 SEO |

---

## Notable decisions

Most of what is interesting here is not the feature list but why things are
built the way they are.

**Language lives in the URL, not in state.** English is served from the root and
Turkish under `/tr`, so both are separately indexable, a shared link keeps its
language, and `<html lang>` is derived from the route rather than hardcoded.
Route slugs live in one JSON file that the router, the navbar and the sitemap
generator all read, so the three cannot drift apart.

**Canonical URLs are per route.** As a SPA the site originally carried a single
canonical tag in `index.html`, which meant every route claimed to be the home
page. `useDocumentMeta` now sets canonical, `og:url` and hreflang alternates per
route; the sitemap emits all ten URLs with matching alternates.

**Images are generated, never committed by hand.** `assets-source/` holds
full-resolution PNGs. A sharp pipeline crops project screenshots to a shared
2:1 ratio, resizes everything to twice its on-screen size, and emits WebP into
`src/assets/`. 3.73 MB of sources become 233 KB of output, and every project
card gets an identical box without CSS letterboxing.

**Vite's asset inlining had to be turned off.** The default inlines anything
under 4 kB as base64, which caught most of the WebP icons and pushed the bundle
from 104 kB to 140 kB gzip — base64 inflates by a third and gzips poorly.
`assetsInlineLimit: 0` recovered it.

**The contact endpoint is owned end to end.** `api/contact.ts` validates with a
Zod schema shared with the form, rejects requests whose `Origin` is not ours,
caps body size, rate limits per IP, checks a honeypot, and verifies a Cloudflare
Turnstile token before Resend sends the mail. The client uses the same schema for
instant feedback, but the server is the only gate. Verified with curl: a request
carrying a forged `Origin` header still returns `403 humanCheckFailed`.

**Visitor stats were reworked for correctness.** The counter used to read then
write, losing an increment under concurrent visits; it is now a transaction.
Deduplication moved from localStorage — which a visitor can clear — to a
server-side claim guarded by rules that allow creation but never update.
`lastSeen` is a `serverTimestamp()` that the security rules require, so a client
cannot forge a permanent presence. Active users come from an indexed
`orderByChild` query over a sliding window instead of downloading the whole node.

**CI asserts on what is deterministic.** Lighthouse's performance score swung
thirty points between runs on shared GitHub runners, so it warns rather than
blocks. `total-byte-weight`, `modern-image-formats` and the minification audits
block — they catch the regression that actually matters (a large unoptimised
image sneaking back in) and cannot be moved by CPU contention.

**Fonts are self-hosted.** Google Fonts cost two extra DNS and TLS handshakes
before first paint and sent every visitor's IP address to Google. Raleway now
ships through npm as a variable font, lands in `/assets` with a content hash, and
falls under the one-year immutable cache rule.

## Tech stack

| Layer     | Choice                                                  |
| --------- | ------------------------------------------------------- |
| Framework | React 18, TypeScript (strict)                           |
| Build     | Vite                                                    |
| Routing   | react-router-dom                                        |
| Styling   | Tailwind CSS                                            |
| Data      | Firebase Realtime Database, Anonymous Auth              |
| Backend   | Vercel Functions, Zod, Resend, Cloudflare Turnstile     |
| Testing   | Vitest, Testing Library                                 |
| Quality   | ESLint (flat config, jsx-a11y), Prettier, Lighthouse CI |
| Hosting   | Vercel                                                  |

## Getting started

Requires Node.js 24.x.

```bash
git clone https://github.com/ibznroglu/MyPortfolio.git
cd MyPortfolio
npm install
cp .env.example .env.local   # Firebase values; Turnstile and Resend are optional locally
npm start
```

The dev server runs at `http://localhost:3000`.

`/api/contact` does not run under the Vite dev server; use `npx vercel dev` or
test it on a preview deployment. Without `TURNSTILE_SECRET_KEY` the endpoint
skips the human check and falls back to its other guards, so local development
works without a Cloudflare account.

## Scripts

| Command                   | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| `npm start`               | Dev server with hot reload                                   |
| `npm run build`           | Production build into `build/`, then regenerates the sitemap |
| `npm run preview`         | Serves the production build locally                          |
| `npm test`                | Vitest run                                                   |
| `npm run typecheck`       | `tsc --noEmit`                                               |
| `npm run lint`            | ESLint over `src/`, `api/` and the build scripts             |
| `npm run lighthouse`      | Lighthouse CI against a local preview                        |
| `npm run optimize:images` | Regenerates WebP assets from `assets-source/`                |

## Project structure

```
.
├── api/
│   └── contact.ts              # Serverless contact endpoint
├── assets-source/              # Full-resolution PNG originals, never bundled
├── public/                     # Copied verbatim: favicons, resume, robots.txt
├── scripts/
│   ├── generate-sitemap.js     # Ten URLs with hreflang, lastmod from git
│   └── optimize-images.js      # sharp pipeline: crop, resize, WebP
├── src/
│   ├── assets/                 # Generated WebP output
│   ├── components/
│   ├── config/firebase.ts
│   ├── context/                # Language context and provider, split apart
│   ├── hooks/                  # useLanguage, useDocumentMeta, useVisitorTracking
│   ├── lib/
│   │   ├── contactSchema.ts    # Shared by the form and the API route
│   │   ├── navigation.ts
│   │   ├── routes.json         # Single source of truth for slugs
│   │   └── translations.ts     # Bundles with an English fallback
│   ├── locales/                # en.json, tr.json
│   ├── App.tsx
│   └── main.tsx
├── .github/workflows/          # ci.yml, lighthouse.yml
├── index.html                  # Vite entry point, at the root rather than public/
├── vercel.json                 # Rewrites, CSP, HSTS, cache headers
└── lighthouserc.json
```

## Environment

| Variable                  | Where                                                    |
| ------------------------- | -------------------------------------------------------- |
| `VITE_FIREBASE_*`         | Client. Public by design; database rules control access. |
| `VITE_TURNSTILE_SITE_KEY` | Client. Public.                                          |
| `TURNSTILE_SECRET_KEY`    | Server only. Secret.                                     |
| `RESEND_API_KEY`          | Server only. Secret.                                     |
| `CONTACT_TO_EMAIL`        | Server only.                                             |

The `VITE_` prefix is the boundary: anything carrying it is compiled into the
browser bundle, so the two secrets deliberately do not have it.

Preview deployments use Cloudflare's public test keys rather than the real ones.
Turnstile rejects hostnames on the Public Suffix List, so `*.vercel.app` can
never be verified, and preview URLs change with every branch.

## Database rules

```json
{
  "rules": {
    ".read": false,
    ".write": false,

    "totalVisitors": {
      ".read": true,
      ".write": "auth != null && newData.isNumber() && ((!data.exists() && newData.val() === 1) || (data.exists() && newData.val() === data.val() + 1))"
    },

    "countedVisitors": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid && !data.exists()",
        ".validate": "newData.isBoolean()"
      }
    },

    "activeUsers": {
      ".read": true,
      ".indexOn": ["lastSeen"],
      "$uid": {
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "newData.hasChildren(['lastSeen'])",
        "lastSeen": { ".validate": "newData.val() === now" },
        "$other": { ".validate": false }
      }
    }
  }
}
```

Three constraints carry the weight. `totalVisitors` accepts only an increment of
exactly one, so it cannot be reset or inflated. `countedVisitors/$uid` can be
created but never updated or deleted, so nobody can re-claim a first visit.
`lastSeen: newData.val() === now` forces `serverTimestamp()`, which makes a
forged or future-dated presence entry impossible.

## Deployment

Vercel. Pushes to `master` deploy to production; every other branch produces a
preview. `master` is protected: pull requests only, and the CI check must pass.

`vercel.json` pins the framework and output directory, rewrites unknown paths to
`index.html` for client-side routing, and sets CSP, HSTS, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy` and a one-year immutable cache on hashed
assets.

The CSP allows `challenges.cloudflare.com` for Turnstile and
`*.firebaseio.com` in `script-src` — Firebase falls back to long polling when
WebSocket is blocked, and that transport injects a script tag.

## Dependency audit

`npm audit` reports findings in the development toolchain. None of them reach the
production bundle, which ships React, React Router, the Firebase Web SDK, Zod and
react-icons — none of which appear in any advisory.

Five findings remain, all from the `@lhci/cli` chain: a symlink issue and a path
traversal in `tmp`, a bounds check in `uuid`, and two transitive advisories via
`inquirer`. All are exploitable only by code already running on the build
machine. `npm audit fix --force` would resolve them by downgrading to
`@lhci/cli@0.1.0`, released in 2020, which removes the performance budgets
entirely. Keeping the tooling is the better trade.

Reviewed 2026-08-09.

## License

MIT — see [LICENSE](LICENSE).

## Author

**İsa Bezeniroğlu** — Frontend Developer

- Email: <ibznroglu@gmail.com>
- LinkedIn: [isabezeniroglu](https://www.linkedin.com/in/isabezeniroglu/)
- GitHub: [ibznroglu](https://github.com/ibznroglu)
