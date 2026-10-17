# Decisions

Settled choices for Wards, newest first. Each entry says what was decided and why.

| Date | Decision | Why |
|---|---|---|
| 2026-10-16 | Branch + pull request workflow: `main` is live; one short-lived branch per task; merge after review. | Unfinished work never reaches the live app; every change is reviewable and easy to undo. |
| 2026-10-16 | Design system: **AKG Design System**, based on Apple's HIG and the iOS 27 / macOS 27 Sketch kits, shared across all AKG projects. | One consistent, native-feeling look reused across future Apple-platform projects. |
| 2026-10-16 | Code and history live in the GitHub repo `akgrepos/wards` (public). | Version history and backup; public is required for free GitHub Pages. |
| 2026-10-16 | Hosting: GitHub Pages. | Free, automatic deploys from `main`, HTTPS, works as a Home Screen web app. |
| 2026-10-16 | Name: **Wards**. | Short enough for a Home Screen label. |
| 2026-10-16 | Delivery: web app added to the iPhone Home Screen, not a native App Store app. | No Xcode, no reinstalling every 7 days, instant updates. |

## Open questions

Not decided yet. Nothing gets built for these until the owner chooses.

- **Tech approach:** plain HTML/CSS/JavaScript with no build step, or a framework?
- **Offline:** should the app work with no signal (cache everything on the phone)?
- **Content:** what goes in, where it comes from, and how each item is verified and dated.
- **Privacy:** is public-by-link acceptable, or should the app require a login (would mean moving off GitHub Pages)?
- **Updates:** version numbering and a changelog so you can tell when your phone has the latest version.
- **Accessibility:** support for larger text sizes and dark mode from day one?
- **Testing:** how each change is checked on a real iPhone before merging.
- **Web address:** keep `akgrepos.github.io/wards` or use a custom domain?
