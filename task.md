# Scrum Redesign — Instrument Sans Theme

## Status
- [x] Design system: Instrument Sans, white bg, editorial
- [x] styles.css rewritten
- [x] lib/utils.ts (cn)
- [x] ui/button.tsx
- [x] ui/badge.tsx
- [x] ui/dialog.tsx
- [ ] ui/input.tsx
- [ ] ui/textarea.tsx
- [ ] ui/select.tsx
- [ ] Sidebar.tsx (minimal, editorial)
- [ ] StickyCard.tsx (cleaner)
- [ ] TaskModal.tsx (use Dialog, shadcn)
- [ ] pages/board.tsx
- [ ] pages/index.tsx (dashboard)
- [ ] pages/timeline.tsx
- [ ] app.tsx

## Design Decisions
- White/off-white (#fafaf8) bg, stark black accents
- Instrument Sans for all headings/buttons
- Instrument Sans for labels, metadata, numbers
- Instrument Sans for body
- Border: thin 1px zinc-200, minimal radius (1-2px)
- No colored backgrounds in UI chrome — colour lives ONLY on sticky notes
- Sticky notes: muted paper tones, subtle shadow
- Column headers: just uppercase mono label + count
- Sidebar: white, thin right border, editorial nav
