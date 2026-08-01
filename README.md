# Portfolio — İsa Bezeniroğlu

Personal portfolio site built with React and Tailwind CSS, featuring bilingual
content (TR/EN), real-time visitor analytics backed by Firebase, and a
build-time generated sitemap.

**Live:** [isabezeniroglu.com](https://isabezeniroglu.com/)

---

## Features

- **Bilingual content** — Turkish and English, switched at runtime through a
  React context provider. No page reload, no route change.
- **Real-time visitor analytics** — Firebase Realtime Database tracks total
  unique visitors and concurrent active users. Presence is maintained with a
  10-second heartbeat and cleaned up via `onDisconnect`, so a closed tab drops
  out of the active count without a server-side job.
- **Responsive dark theme** — Gradient backgrounds and section transitions,
  laid out mobile-first with Tailwind.
- **Section navigation** — Smooth scrolling with active-state indicators via
  `react-scroll`.
- **Project showcase** — Personal projects with live demo and source links.
- **Contact form** — Posts to a [Getform](https://getform.io) endpoint; no
  backend required.
- **SEO metadata** — Canonical URL, Open Graph tags, and `Person` + `WebSite`
  JSON-LD structured data. See [SEO](#seo) below.

## Tech stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | React 18.2                               |
| Styling    | Tailwind CSS 3.3                         |
| Icons      | React Icons                              |
| Scrolling  | react-scroll                             |
| Data       | Firebase Realtime Database 12.x          |
| Forms      | Getform                                  |
| Build      | Create React App (`react-scripts` 5.0.1) |
| Hosting    | Vercel                                   |
| Runtime    | Node.js 24.x                             |

> **Note on the build tool:** Create React App is no longer maintained — the
> last `react-scripts` release was April 2022. It still builds correctly, but a
> migration to Vite is planned. See [Roadmap](#roadmap).

## Getting started

**Prerequisites:** Node.js 24.x (pinned via the `engines` field) and npm.

```bash
git clone https://github.com/ibznroglu/MyPortfolio.git
cd MyPortfolio
npm install
npm start
```

The dev server runs at `http://localhost:3000`.

To run against your own Firebase project, replace the config object in
`src/config/firebase.js`. This object is **not a secret** — a Firebase web
config is a public identifier, not a credential, and ships inside the client
bundle regardless. Access is controlled by database rules, not by hiding the
config. See [Firebase setup](#firebase-setup).

## Scripts

| Command         | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| `npm start`     | Development server with hot reload                              |
| `npm run build` | Production build into `build/`                                  |
| `postbuild`     | Runs automatically after `build`; regenerates `build/sitemap.xml` |

## Project structure

```
.
├── public/                     # Static assets copied verbatim into build/
│   ├── favicon.ico             # 48–256px multi-resolution icon set
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   └── sitemap.xml             # Fallback; overwritten at build time
├── scripts/
│   └── generate-sitemap.js     # Emits sitemap.xml with a derived lastmod
├── src/
│   ├── assets/                 # Images and logos
│   ├── components/             # Home, About, Skills, Work, Contact, navbar
│   ├── config/
│   │   └── firebase.js         # Firebase app initialisation
│   ├── context/
│   │   └── LanguageContext.js  # TR/EN provider and translation lookup
│   ├── data/                   # Project and content data
│   ├── helpers/
│   ├── hooks/
│   │   └── useVisitorTracking.js
│   ├── App.js
│   └── index.js
├── vercel.json
└── tailwind.config.js
```

## SEO

The site is a single-route SPA, so all metadata lives in `public/index.html`
and is served statically — crawlers do not need to execute JavaScript to read
it.

- **Canonical URL** pins the site to one address, preventing duplicate
  indexing across Vercel preview and legacy deployment domains.
- **`WebSite` JSON-LD** with `name` and `alternateName` signals the preferred
  site name to Google.
- **`Person` JSON-LD** links the profile to LinkedIn and GitHub via `sameAs`.
- **Open Graph and Twitter Card** tags control link previews.
- **Favicon set** is provided at 48px and above in line with Google's
  guidance, so search results show the brand mark rather than a default icon.

### Sitemap generation

`sitemap.xml` is not maintained by hand. The `postbuild` hook derives
`<lastmod>` from the most recent commit that touched `src/` or `public/`:

```bash
git log -1 --format=%cs -- src public
```

Using the commit date rather than the build date matters: a `lastmod` that
always reads "today" is inaccurate, and Google learns to ignore the field for
sites that report it that way. When git history is unavailable — for example
under a shallow CI clone — the script falls back to the build date and logs a
warning so the degradation is visible in build output rather than silent.

## Firebase setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Realtime Database.
3. Apply the rules below.
4. Copy the web config into `src/config/firebase.js`.

### Database rules

```json
{
  "rules": {
    ".read": false,
    ".write": false,

    "totalVisitors": {
      ".read": true,
      ".write": "newData.isNumber() && ((!data.exists() && newData.val() === 1) || (data.exists() && newData.val() === data.val() + 1))"
    },

    "activeUsers": {
      ".read": true,

      "$visitorId": {
        ".write": true,
        ".validate": "$visitorId.length <= 64 && newData.hasChildren(['timestamp', 'lastSeen'])",

        "timestamp": { ".validate": "newData.isNumber()" },
        "lastSeen":  { ".validate": "newData.isNumber()" },
        "$other":    { ".validate": false }
      }
    }
  }
}
```

Because the client is unauthenticated, these rules constrain writes by shape
rather than by identity:

- `totalVisitors` accepts only a monotonic increment of exactly one. It cannot
  be reset, decremented, or set to a non-numeric value.
- Write access on `activeUsers` is granted per key, not on the node itself. A
  client can only write its own presence entry, so no single request can
  overwrite or inflate the whole collection — which matters because every
  visitor subscribes to that node and would download whatever it contains.
- Presence entries must be exactly `{ timestamp, lastSeen }` with numeric
  values. Extra fields are rejected.

## Deployment

Deployed on Vercel. Pushes to `master` trigger a production deployment; every
other branch produces a preview deployment.

| Setting          | Value           |
| ---------------- | --------------- |
| Build command    | `npm run build` |
| Output directory | `build`         |
| Node.js version  | 24.x            |

## Roadmap

- Migrate from Create React App to Vite, and upgrade to React 19 and
  Tailwind CSS 4. This removes an unmaintained toolchain and the transitive
  deprecation warnings it emits on modern Node.
- Replace the read-then-write visitor counter with `runTransaction` to
  eliminate the lost-update race under concurrent visits.

## License

MIT — see [LICENSE](LICENSE).

## Author

**İsa Bezeniroğlu** — Frontend Developer

- Email: <ibznroglu@gmail.com>
- LinkedIn: [isabezeniroglu](https://www.linkedin.com/in/isabezeniroglu/)
- GitHub: [ibznroglu](https://github.com/ibznroglu)