# Status

Last updated 2026-10-16 (after the design system second pass). A plain-language snapshot so the next session can pick up where the last one stopped.

## Done
- **Foundations decided** and recorded in [DECISIONS.md](DECISIONS.md): stack, offline, content storage, privacy, updates, display, testing, merging, web address.
- **Repo set up:** `akgrepos/wards` on GitHub with README, Claude notes (`CLAUDE.md`), decisions log, editor settings. Branch + pull request workflow in use.
- **AKG Design System published (second pass):** https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru
  - Colors, type, spacing, radii, shadows and control sizes taken from Apple's iOS 27 and macOS 27 UI kits, with light and dark values for both platforms.
  - A brand book (usage rules, writing style, Liquid Glass, icons, which control to use on which platform, and native SwiftUI/UIKit/AppKit equivalents for every token).
  - 30 components, each checked in all four themes: Button, Toggle, Checkbox, RadioGroup, SegmentedControl, PopUpButton, Stepper, TextField, SearchField, ComboBox, Slider, DatePicker, ColorWell, List, GroupBox, DisclosureGroup, ProgressIndicator, EmptyState, Notification, Tooltip, TabBar, Toolbar, Sidebar, PageControl, Window, Sheet, Alert, ActionSheet, Menu, Popover.
  - macOS mini and XL sizes on buttons, toggles, segmented controls, steppers and fields; tinted and toggle button styles.

## Not started (no app code exists yet)
- App scaffold with the decided stack: React + TypeScript + Vite, PWA plugin, GitHub Actions checks and deploy, Dependabot, `noindex` + `robots.txt`, `CHANGELOG.md`.
- Turning on GitHub Pages (happens with the scaffold, so the address doesn't serve an empty site).

## Waiting on the owner
- **Content authorship and verification:** who writes entries and how each is marked verified (the one open question in DECISIONS.md).
- **Go-ahead for the app scaffold** (the likely next step now that the design system is fuller).

## Possible later work on the design system
Not requested yet; listed so nothing is forgotten.
- Remaining kit items: "Over-glass" and inactive-window variants, iOS wheel-style date picker, full color spectrum picker, iPad-specific menus and popover arrows, macOS toolbar pop-ups. Each component's README lists what it skipped under Notes.
- System-provided UI not built on purpose (the OS draws it): keyboards, share sheet, Face ID, menu bar and Dock, scroll bars.
- Known approximations: Liquid Glass is a translucent blur plus shadow (CSS can't reproduce Apple's full effect), and icons are simple SVG stand-ins for SF Symbols.
