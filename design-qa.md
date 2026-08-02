# State Hero Abbreviation Removal — Design QA

**Source visual truth**

- User direction: preserve the current state-page hero but remove the oversized graphical state abbreviation behind every state outline.
- Before capture: `/Users/chadstroud/.codex/visualizations/2026/08/01/019fbe59-287c-7581-ac57-d9b88ea6ce30/texas-before-abbreviation-removal.png`

**Implementation evidence**

- Texas after capture: `/Users/chadstroud/.codex/visualizations/2026/08/01/019fbe59-287c-7581-ac57-d9b88ea6ce30/texas-after-abbreviation-removal.png`
- Virginia spot-check: `/Users/chadstroud/.codex/visualizations/2026/08/01/019fbe59-287c-7581-ac57-d9b88ea6ce30/virginia-after-abbreviation-removal.png`
- Browser-rendered URL: `http://localhost:3000/states/texas`

**Comparison setup**

- State: Texas, desktop, dark theme, signed out, 4 active jobs.
- Browser CSS viewport: 1270 × 714 at device density 1.
- Source pixels: 1270 × 714.
- Implementation pixels: 1270 × 714.
- Density normalization: none required; source and implementation use the same viewport and pixel dimensions.
- Full-view evidence: the before and after captures were opened together in the same browser comparison result. The only intended visual difference is removal of the outlined `TX` layer.
- Focused-region evidence: the hero artwork region was large enough in the matched full-view captures to judge the outline, background, alignment, glow, and abbreviation removal. A separate crop was not needed.

**Findings**

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: the headline, eyebrow, supporting heading, body copy, alert link, navigation, and job heading are unchanged. No wrapping or hierarchy regression was introduced.
- Spacing and layout rhythm: removing the abbreviation leaves the state outline centered in the same hero-art slot. Hero height, text column, divider, and jobs-first placement remain unchanged.
- Colors and visual tokens: the navy and ice-blue palette is unchanged. The state outline retains its cyan stroke, subtle fill, and glow without the competing outlined letters.
- Image quality and asset fidelity: the existing blue signal-grid background remains sharp and correctly positioned. The Census-derived Texas and Virginia outlines remain upright, recognizable, and unobstructed.
- Copy and content: no page copy, state-specific SEO content, job data, metadata, routes, or controls changed.
- Responsiveness: the existing behavior remains intact; state artwork is hidden below the large breakpoint and the abbreviation layer no longer exists at any breakpoint.
- Accessibility: the decorative outline remains `aria-hidden`; removing the decorative letters does not remove meaningful content because the state name remains in the eyebrow, headline, breadcrumb, and job heading.

**Comparison history**

1. Earlier implementation finding: the large outlined `TX` behind the Texas shape competed with the boundary and made the graphic feel cluttered.
2. Fix: removed the abbreviation element and its text-stroke styling from `StateOutline`, leaving the correctly projected geographic outline as the sole hero graphic.
3. Post-fix evidence: the matched Texas capture shows a cleaner, immediately readable outline with unchanged alignment and hero balance. Virginia was spot-checked and shows the same improvement without a layout regression.

**Implementation checklist**

- [x] Remove graphical abbreviations from every state hero
- [x] Preserve state outlines and blue hero palette
- [x] Preserve hero dimensions and jobs-first hierarchy
- [x] Verify Texas before/after at the same viewport
- [x] Spot-check Virginia
- [x] Run typecheck, tests, and lint

**Follow-up polish**

- No P3 visual change is required for this release.

final result: passed
