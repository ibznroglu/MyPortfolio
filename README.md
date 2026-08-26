# Portfolio — İsa Bezeniroğlu

Bilingual portfolio site. React 18 and TypeScript on Vite, deployed on Vercel,
with a serverless contact endpoint, prerendered per-route metadata and a visitor
counter on Firebase.

**Live:** [isabezeniroglu.com](https://isabezeniroglu.com/)

|               |                                                                          |
| ------------- | ------------------------------------------------------------------------ |
| Landing route | 88 kB gzip (Contact adds 19 kB for Zod and Turnstile)                    |
| Deferred      | 65 kB of Firebase, fetched only when the visitor counter comes on screen |
| Images        | 269 KB total, generated from 5.9 MB of sources                           |
| PageSpeed     | Desktop 100 across the board · mobile 98 performance, 100 elsewhere      |
| Tests         | 23, on routing, metadata, accessibility and the theme                    |

---

## Notable decisions

Most of what is interesting here is not the feature list but why things are
built the way they are.

**Case studies have their own routes.** Each project write-up lives at
`/projects/<slug>` and its Turkish twin under `/tr`, lazily loaded at about 1 kB
gzip each. The slugs sit in their own module rather than in `routes.json`: they
are addressable pages but not navigation items, so they belong in the sitemap
and not in the navbar. That brings the sitemap to 16 URLs.

**Language lives in the URL, not in state.** English is served from the root and
Turkish under `/tr`, so both are separately indexable, a shared link keeps its
language, and `<html lang>` is derived from the route rather than hardcoded.
Route slugs live in one JSON file that the router, the navbar and the sitemap
generator all read, so the three cannot drift apart.

**Metadata is written into the HTML, not applied afterwards.** A catch-all
rewrite serves the same `index.html` for every URL, so the title, description
and canonical were only corrected once React had mounted. Search engines render
JavaScript eventually; the crawlers behind link previews never do, and sharing a
case study showed the home page's title instead of the article's.
`scripts/prerender.js` now writes one HTML file per route after the build,
sixteen in all, each with its own title, description, canonical, `og` tags,
hreflang alternates and `html lang`. Vercel resolves the filesystem before
rewrites, so `/about` serves `build/about/index.html` with no extra config.

The formula lives in `src/lib/pageMeta.ts` because the runtime and the build
step both need it, and a second copy would let the rendered page and the crawled
page drift apart with nothing to catch it. The script loads that module through
Vite's own SSR loader, so there is no duplicate resolution logic and no extra
dependency. `localizedHref` reproduces `generate-sitemap.js` down to the
trailing slash on the home page, so the canonical a crawler reads and the URL
the sitemap advertises are the same string.

**Images are generated, never committed by hand.** `assets-source/` holds
full-resolution PNGs. A sharp pipeline crops project screenshots to a shared
2:1 ratio, resizes everything to twice its on-screen size, and emits WebP into
`src/assets/`. 5.9 MB of sources become 269 KB of output, and every project
card gets an identical box without CSS letterboxing.

Project cards ship two widths behind `srcset`. A 1100px source went into a card
that is never wider than about 405px, so a 1x screen now takes 560w and a 2x
screen 900w — 104 kB instead of 147, and 62 kB where the device does not need
the density. The widths follow what the card measures rather than round numbers:
an earlier pass at 400w and 800w looked soft on a 1x desktop, because 400w
against 370px displayed leaves no downscale to hide compression behind.

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

**Visitor stats were reworked for correctness, then for weight.** The counter
used to read then write, losing an increment under concurrent visits; it is now
a transaction. Deduplication moved from localStorage — which a visitor can
clear — to a server-side claim guarded by rules that allow creation but never
update.

The Firebase SDK also used to sit in the home route's chunk, so every landing
visit downloaded 72 kB gzip before first paint to render a figure nobody had
asked for. All Firebase usage now lives in `src/lib/visitorStats.ts`, imported
dynamically once the footer is on screen. The named imports stay inside that
module on purpose: `import('firebase/database')` at the call site defers the SDK
but keeps the whole namespace alive, and measured 91 kB against 65.

The live-user figure is gone with it. On a personal site it read zero most of
the time, which says less than showing nothing, and removing it took the
presence heartbeat, the sliding-window query and the server clock offset along
with it.

Deciding when the counter is "on screen" took three attempts. An
`IntersectionObserver` started at mount fires immediately, because
`RouteFallback` fills the same `section-shell` every page uses and leaves the
footer at the fold while a lazy chunk is in flight. The `load` event is no
better: a lazily imported route is not part of the document's load. `RouteReady`
renders nothing inside the Suspense boundary, so it mounts only once the chunk
has resolved, and the footer waits for that.

**CI asserts on what is deterministic.** Lighthouse's performance score swung
thirty points between runs on shared GitHub runners, so it warns rather than
blocks. `total-byte-weight`, `modern-image-formats` and the minification audits
block — they catch the regression that actually matters (a large unoptimised
image sneaking back in) and cannot be moved by CPU contention.

There are two configs now. The original ran with `preset: "desktop"`, which
meant nothing in CI had ever measured the form factor PageSpeed defaults to.
`lighthouserc.mobile.json` mirrors every assertion under a 412x823 viewport with
4x CPU throttling, and it earned its place on the first run: `--muted` had never
cleared AA on any background except the one pairing this file happened to
measure, and the footer that renders it is hidden above `lg`. It found two more
since — redundant alt text on the skill icons, and a scroll cue that landed
below the fold on a 375px phone.

Both configs also stopped silently ignoring their own port. `npx vite preview --
--port 4174` never passed the flag through, because npx consumes everything
after `--`; preview fell back to its default and the desktop config had been
hiding the same mistake for months by happening to use that default.

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

| Command                     | Description                                                       |
| --------------------------- | ----------------------------------------------------------------- |
| `npm start`                 | Dev server with hot reload                                        |
| `npm run build`             | Production build into `build/`, then sitemap and prerendered HTML |
| `npm run preview`           | Serves the production build locally                               |
| `npm test`                  | Vitest run                                                        |
| `npm run typecheck`         | `tsc --noEmit`                                                    |
| `npm run lint`              | ESLint over `src/`, `api/` and the build scripts                  |
| `npm run lighthouse`        | Lighthouse CI against a local preview, desktop                    |
| `npm run lighthouse:mobile` | The same assertions under mobile emulation                        |
| `npm run optimize:images`   | Regenerates WebP assets from `assets-source/`                     |

## Project structure

```
.
├── api/
│   └── contact.ts              # Serverless contact endpoint
├── assets-source/              # Full-resolution PNG originals, never bundled
├── public/                     # Copied verbatim: favicons, resume, robots.txt
├── scripts/
│   ├── generate-sitemap.js     # Sixteen URLs with hreflang, lastmod from git
│   ├── prerender.js            # One HTML file per route, with its own metadata
│   └── optimize-images.js      # sharp pipeline: crop, resize, WebP
├── src/
│   ├── assets/                 # Generated WebP output
│   ├── components/
│   ├── context/                # Language context and provider, split apart
│   ├── data/                   # Projects, skills, social links, resume
│   ├── hooks/                  # useLanguage, useDocumentMeta, useVisitorTracking
│   ├── lib/
│   │   ├── caseStudies.ts      # Slugs: addressable pages, not nav items
│   │   ├── contactSchema.ts    # Shared by the form and the API route
│   │   ├── navigation.ts
│   │   ├── pageMeta.ts         # Shared by the runtime and the prerender step
│   │   ├── routes.json         # Single source of truth for slugs
│   │   ├── translations.ts     # Bundles with an English fallback
│   │   └── visitorStats.ts     # The only Firebase import, loaded on demand
│   ├── locales/                # en.json, tr.json
│   ├── App.tsx
│   └── main.tsx
├── .github/workflows/          # ci.yml, lighthouse.yml
├── index.html                  # Vite entry point, at the root rather than public/
├── vercel.json                 # Rewrites, CSP, HSTS, cache headers
├── lighthouserc.json           # Desktop budget
└── lighthouserc.mobile.json    # The same assertions on a phone
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
    }
  }
}
```

Two constraints carry the weight. `totalVisitors` accepts only an increment of
exactly one, so it cannot be reset or inflated. `countedVisitors/$uid` can be
created but never updated or deleted, so nobody can re-claim a first visit.

An `activeUsers` node used to sit alongside them, with an index on `lastSeen`
and a `newData.val() === now` rule that forced `serverTimestamp()` so a client
could not forge a permanent presence. It was removed with the live-user figure
it fed.

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

It was not widened for Firebase Auth. `getAuth` installs the popup and redirect
resolver whether or not an app signs in that way, which loads `apis.google.com`
and opens a hidden iframe; anonymous sign-in uses neither, so both requests were
blocked and logged on every visit. `initializeAuth` without a
`popupRedirectResolver` removes the behaviour and lets that code tree-shake out.
Silencing the errors by permitting the requests would have been the wrong half
of the fix.

## Themes

Colour lives in CSS variables as RGB channel triplets rather than finished
colours, which is what keeps Tailwind's alpha modifier working —
`bg-surface/95` resolves to `rgb(var(--surface) / 0.95)`, and the header needs
that for its translucent blur. It also rules out the `light-dark()` CSS
function, which returns a colour and cannot be sliced this way. `color-scheme`
is set alongside `data-theme`, so scrollbars and form controls follow natively.

Dark is the default and light is the override, so a visitor without JavaScript
gets the design as intended. `public/theme-init.js` applies the stored or system
preference before the first paint; it is a separate file rather than an inline
block because the CSP allows `script-src 'self'` only.

Measured contrast, both palettes, both surfaces:

|             | Light page | Light card | Dark page | Dark card |
| ----------- | ---------- | ---------- | --------- | --------- |
| Heading     | 12.90      | 14.48      | 12.17     | 10.94     |
| Body        | 6.20       | 6.96       | 5.69      | 5.11      |
| Muted       | 5.24       | 5.89       | 5.50      | 4.95      |
| Accent-soft | 5.38       | 6.04       | 4.99      | 4.49      |

White on the accent fill measures 6.04 in light and 4.60 in dark. The accent is
pink-700 in light and pink-600 in dark; pink-600 on white measures 4.56, which
clears AA by 0.06 — too little room for a palette that will be edited again.

An earlier version of this table listed the light palette only, and only on
cards. That was the single pairing `--muted` happened to pass: it measured 3.64
and 3.27 on the dark palette and 4.24 on the light page, all below AA. Nothing
caught it because the footer is the main place the token renders and the footer
was hidden above `lg`, so the desktop budget never saw it. The mobile budget
failed on it within one run of being added.

Dark on card is the tight one at 4.95, and it cannot go higher without
overtaking `--body` at 5.11: on a dark surface more contrast means a lighter
colour, so "dimmer than body" caps it. Accent-soft at 4.49 is used for icons and
a decorative chevron, where the requirement is 3.0 for a graphical object.

**The CI budgets only cover the dark theme.** Lighthouse runs without
`data-theme` set, so the light figures above are calculated rather than
asserted. The alternative was a query parameter that switches themes, which
means shipping a test hook in production code to cover a palette that changes
rarely. This is a known gap, recorded here rather than left to be discovered.

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

Reviewed 2026-08-26.

## License

MIT — see [LICENSE](LICENSE).

## Author

**İsa Bezeniroğlu** — Frontend Developer

- Email: <ibznroglu@gmail.com>
- LinkedIn: [isabezeniroglu](https://www.linkedin.com/in/isabezeniroglu/)
- GitHub: [ibznroglu](https://github.com/ibznroglu)
