# Status

Last updated 2026-10-17 (after the app setup). A plain-language snapshot so the next session can pick up where the last one stopped.

## Done
- **Foundations decided** and recorded in [DECISIONS.md](DECISIONS.md): stack, offline, content storage, privacy, updates, display, testing, merging, web address.
- **Repo set up:** `akgrepos/wards` on GitHub with README, Claude notes (`CLAUDE.md`), decisions log, editor settings. Branch + pull request workflow in use.
- **AKG Design System published (second pass):** https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru
  - Colors, type, spacing, radii, shadows and control sizes taken from Apple's iOS 27 and macOS 27 UI kits, with light and dark values for both platforms.
  - A brand book (usage rules, writing style, Liquid Glass, icons, which control to use on which platform, and native SwiftUI/UIKit/AppKit equivalents for every token).
  - 30 components, each checked in all four themes: Button, Toggle, Checkbox, RadioGroup, SegmentedControl, PopUpButton, Stepper, TextField, SearchField, ComboBox, Slider, DatePicker, ColorWell, List, GroupBox, DisclosureGroup, ProgressIndicator, EmptyState, Notification, Tooltip, TabBar, Toolbar, Sidebar, PageControl, Window, Sheet, Alert, ActionSheet, Menu, Popover.
  - macOS mini and XL sizes on buttons, toggles, segmented controls, steppers and fields; tinted and toggle button styles.
- **App set up (version 2026.10.17):** live at https://akgrepos.github.io/wards/
  - React + TypeScript + Vite, with a home screen that says "No Entries Yet" and shows the version.
  - Works offline once opened; installs to the Home Screen with its own icon (a reference card with a blue plus; version 2026.10.17.2).
  - Follows light/dark and the iPhone's Text Size. Shows "Update Ready · Reload" when a new version has downloaded, and checks for one each time the app comes back to the front.
  - Automatic checks on every pull request (design system styles up to date, type-check, tests, build); `main` publishes to GitHub Pages after the same checks. Dependabot opens weekly update PRs.
  - Hidden from search engines (`noindex` + `robots.txt`). `CHANGELOG.md` lists each version.
  - `main` is protected (checks must pass; no overwriting). Commits are anonymous (`akgrepos`, private no-reply email); history was rewritten to match. Only rebase merges are allowed; Issues, Wiki and Projects are off; Dependabot security alerts and fixes are on.

## Not started
- Any content or content screens (entry list, entry page, search). Waits on the content question below.

## Waiting on the owner
- **Content authorship and verification:** who writes entries and how each is marked verified (the one open question in DECISIONS.md).

## Waiting on the owner (account security)
- Recommended in GitHub account settings: two-factor sign-in (passkey), clear the display name "AG", make the profile private, review authorized apps, keep the akgrepos and personal accounts separate.

## Known limits of the app setup
- GitHub still holds hidden copies of the original (pre-rewrite) commits behind pull requests #1–#7. Only GitHub Support, or deleting and re-creating the repo, can remove them.
- The account name `akgrepos` and the AKG Design System name are the owner's initials.
- The design system's components (buttons, banners, lists) use fixed sizes, so their text doesn't follow the iPhone's Text Size yet; the app's own text does. Fixing that is a design system change, for the owner to decide.
- The installed app shows a brief black screen while it starts (iOS's default for web apps without a launch image).

## Possible later work on the design system
Not requested yet; listed so nothing is forgotten.
- Remaining kit items: "Over-glass" and inactive-window variants, iOS wheel-style date picker, full color spectrum picker, iPad-specific menus and popover arrows, macOS toolbar pop-ups. Each component's README lists what it skipped under Notes.
- System-provided UI not built on purpose (the OS draws it): keyboards, share sheet, Face ID, menu bar and Dock, scroll bars.
- Known approximations: Liquid Glass is a translucent blur plus shadow (CSS can't reproduce Apple's full effect), and icons are simple SVG stand-ins for SF Symbols.
