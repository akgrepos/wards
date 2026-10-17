# Status

Last updated 2026-10-16. A plain-language snapshot so the next session can pick up where the last one stopped.

## Done
- **Foundations decided** and recorded in [DECISIONS.md](DECISIONS.md): stack, offline, content storage, privacy, updates, display, testing, merging, web address.
- **Repo set up:** `akgrepos/wards` on GitHub with README, Claude notes (`CLAUDE.md`), decisions log, editor settings. Branch + pull request workflow in use.
- **AKG Design System, first version, published:** https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru
  - Colors, type, spacing, radii, shadows and control sizes taken from Apple's iOS 27 and macOS 27 UI kits, with light and dark values for both platforms.
  - A brand book (usage rules, writing style, Liquid Glass, icons, and native SwiftUI/UIKit/AppKit equivalents for every token).
  - 16 components, each tested in all four themes: Button, Toggle, SegmentedControl, Stepper, TextField, SearchField, Slider, List, ProgressIndicator, TabBar, Toolbar, Sidebar, Sheet, Alert, Menu, Popover.

## Not started (no app code exists yet)
- App scaffold with the decided stack: React + TypeScript + Vite, PWA plugin, GitHub Actions checks and deploy, Dependabot, `noindex` + `robots.txt`, `CHANGELOG.md`.
- Turning on GitHub Pages (happens with the scaffold, so the address doesn't serve an empty site).

## Waiting on the owner
- **Content authorship and verification:** who writes entries and how each is marked verified (the one open question in DECISIONS.md).
- **What to do next:** set up the app scaffold, or extend the design system first.

## Possible later work on the design system
Not requested yet; listed so nothing is forgotten.
- Platform-only components: macOS checkboxes, radio buttons, pop-up and pull-down buttons, combo boxes, windows, disclosure controls; iOS action sheets, date and time pickers, page controls.
- Sizes and variants the first version skipped (macOS mini and XL controls, over-glass variants), listed in each component's Notes.
- Known approximations: Liquid Glass is a translucent blur plus shadow (CSS can't reproduce Apple's full effect), and icons are simple SVG stand-ins for SF Symbols.
