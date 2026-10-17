# Decisions

Settled choices for Wards, newest first. Each entry says what was decided and why.

| Date | Decision | Why |
|---|---|---|
| 2026-10-17 | **Repo settings:** only rebase merges are allowed (GitHub keeps the anonymous author); merged branches delete themselves; Issues, Wiki and Projects are off; Dependabot security alerts and automatic security fixes are on (alongside secret scanning and push protection). | Keeps the public repo anonymous and minimal, and patches known security holes quickly. |
| 2026-10-17 | **App icon:** a white reference card with a small blue plus and gray "text" lines, on a light background (design system colors only, following Apple's app icon guidelines). Source: `public/favicon.svg`. | Quiet, readable at small sizes, and says "medical reference." Red was ruled out because the red cross is a protected emblem. |
| 2026-10-17 | **Anonymity:** commits are authored as `akgrepos` with GitHub's private no-reply address; past history was rewritten the same way and the owner's name removed from all files. GitHub's "keep my email private" setting is on. Repo text refers to "the owner." | The site and repo are public; keep them as anonymous as possible. |
| 2026-10-17 | **Branch protection:** `main` only accepts changes whose checks pass and are up to date, applies to admins too, and can't be force-pushed or deleted. | Nothing broken reaches the live app. |
| 2026-10-17 | **Dependabot updates** are handled like any pull request: Claude reviews the changes, waits for the checks, tests if anything visible changed, and merges. | Keeps tools current without routine approvals. |
| 2026-10-17 | **Design system in the app:** a copy of the AKG Design System's files lives in `vendor/akg/`; `npm run tokens` turns its tokens into CSS (`src/design/tokens.css`), with iOS text styles scaled from the iPhone's Text Size. A check fails if that file is out of date. | Works offline with no outside downloads, and the app always matches a known version of the design system. |
| 2026-10-17 | **Version number** lives in `src/version.ts`; a test fails if it doesn't match the newest `CHANGELOG.md` entry. | The version shown in the app and the changelog can't drift apart. |
| 2026-10-17 | **Update checks:** besides at launch, the app looks for a new version each time it comes back to the front. | A Home Screen app can stay open in the background for days. |
| 2026-10-16 | **Web address:** `https://akgrepos.github.io/wards/`. | Free, no setup. Decided now because changing the address later means reinstalling the Home Screen app. |
| 2026-10-16 | **Merging:** Claude merges each pull request once automated checks pass and its own simulator check looks right. The owner reviews by using the app and asks for changes in chat. | Keeps the owner out of routine approvals while every change still passes automated and visual checks. |
| 2026-10-16 | **Testing:** automated checks on every PR (build, type-check, tests), plus Claude testing each change in the iOS 27 Simulator (installed as a Home Screen app, light and dark, at least two text sizes) and attaching screenshots to the PR. | Real iOS Safari behavior is checked before anything goes live. |
| 2026-10-16 | **Display:** follows the iPhone's Text Size (Dynamic Type) and light/dark appearance. VoiceOver support is not a requirement. Reduced motion and a 44pt tap minimum are not requirements (the design system's controls are 44pt by default anyway). | Readability on shift and at night. |
| 2026-10-16 | **Updates:** when a new version has downloaded, the app shows "Update ready · Reload" and waits for a tap. Versions are date-based (`2026.10.16`, with `.2`, `.3` for later releases the same day), shown in the app, and listed in plain language in `CHANGELOG.md`. | Content never changes mid-read; it's always clear how current the app is. |
| 2026-10-16 | **Privacy:** public by link on free GitHub Pages, hidden from search engines (noindex + robots.txt). The repo stays public, so nothing sensitive or institution-internal goes in. | Simplest option; acceptable for general reference content. |
| 2026-10-16 | **Content storage:** each entry is a file in the repo. All edits are made through Claude in chat and go through a pull request. No in-app or web editing. | Full history of every content change, works offline, no outside service. |
| 2026-10-16 | **Offline:** fully offline. The whole app and all content are saved on the phone; updates download in the background when online. | Hospital signal is unreliable. |
| 2026-10-16 | **Tech stack:** React + TypeScript, built with Vite, offline/install via the Vite PWA plugin. GitHub Actions runs checks on every PR and deploys `main` to Pages. Dependabot opens PRs for tool updates. | Robustness: type safety, automated checks before anything goes live, and maintained dependencies. React matches the AKG Design System's components. |
| 2026-10-16 | Branch + pull request workflow: `main` is live; one short-lived branch per task; merge after checks. | Unfinished work never reaches the live app; every change is recorded and easy to undo. |
| 2026-10-16 | Design system: **AKG Design System**, based on Apple's HIG and the iOS 27 / macOS 27 Sketch kits, shared across all AKG projects. | One consistent, native-feeling look reused across future Apple-platform projects. |
| 2026-10-16 | Code and history live in the GitHub repo `akgrepos/wards` (public). | Version history and backup; public is required for free GitHub Pages. |
| 2026-10-16 | Hosting: GitHub Pages. | Free, automatic deploys from `main`, HTTPS, works as a Home Screen web app. |
| 2026-10-16 | Name: **Wards**. | Short enough for a Home Screen label. |
| 2026-10-16 | Delivery: web app added to the iPhone Home Screen, not a native App Store app. | No reinstalling every 7 days, instant updates. |

## Open questions

Not decided yet. Nothing gets built for these until the owner chooses.

- **Content authorship and verification:** who writes entries (the owner, Claude from cited sources, or both) and how each entry is marked verified.
