# STRATA refinement — 3 October 2026

## Scope and references

Scoped refinement of the established clay, putty and plum material atelier. The coordinating agent completed the context pass; this work did not initialize a new product, rename the studio or change its visual identity.

Read the complete project-local Impeccable `SKILL.md` and all 24 command references: craft, shape, init, document, extract, critique, audit, polish, bolder, quieter, distill, harden, onboard, animate, colorize, typeset, layout, delight, overdrive, clarify, adapt, optimize, live and generate. Read `reference/craft-floor.md` immediately before UI edits. These references informed the implementation; reading them does not imply that all command workflows or their audits were executed.

The seven official GSAP skills are installed at source commit `aed9cfd3277740755f6bfc1155c7aa645403b760`: core, timeline, ScrollTrigger, React, performance, plugins and utilities. The six animation guides were read for camera implementation; the utilities guide was read during the subsequent source review. Runtime versions remain separately pinned in the project's dependency files.

Visual judgment used the existing `docs/media/desktop.webp` and `mobile.webp`, plus the materials and brief desktop captures in `output/playwright`. Those captures established the starting point: the interactive sculpture and color identity worked, but tiny supporting text, compressed tracking, decorative numbering and repeated entrance treatments competed with the work.

## Changes

- Removed decorative kickers and section numbers across home, work, project detail, materials, studio and brief. Project category and finish information now follow their headings.
- Retained the Manrope identity with tracking no tighter than -0.04em. Content display headings are bounded at 96px. Body copy generally uses 16px; longer project narrative uses 18px; labels and secondary controls use 14px. The oversized footer wordmark remains deliberate lettering.
- Added one consistent authored 24px stroke SVG icon system. Menu, navigation, selection, download and motion controls no longer use Unicode glyph icons. No emojis are permitted.
- Improved navigation and form language: the header leads to the named project brief, and its preview/download continues to state that nothing is sent. Selected material buttons have an explicit check mark alongside their existing pressed state.
- Concentrated motion in the hero. After its bounded partial-mask headline reveal, native scroll drives a real Three.js perspective camera and look target through Composition, The curve and The grain. Independent Catmull-Rom paths provide an orbit and approach to the materials. A scoped ScrollTrigger supplies progress with 0.7-second scrub; captions and a progress line follow that scalar. Other route headings do not repeat the entrance, and material details crossfade briefly.
- Added keyboard/touch view buttons and a Skip to projects control that focuses the project heading. Automatic pinning requires viewport height of at least 740px, motion on and no OS reduced-motion preference. Shorter screens use button-driven travel. Motion off/reduced motion cuts between user-selected views without camera animation or pinning. WebGL failure removes pinning and disables the view buttons.
- Made small-screen heading, scene and controls a vertical composition, enlarged material names, and replaced the narrow invitation circle with a readable text link. Larger screens preserve the split composition and circular invitation. The close camera views and control clearances await fresh visual review.
- Replaced the CSS swatch-board illustration with `WorldGallery`, which switches between `/images/strata-world.webp` and `/images/strata-material-study.webp` and their mobile variants. These are wide/detail views of a separately authored Blender atelier. The runtime sculpture is not the Blender room rendered in real time. The coordinating agent is producing final images and the rendering/provenance record.
- Retained all routes, category filters, route titles/focus/history, direct material links, local brief validation/preview/download, motion preferences, WebGL fallback and existing resource disposal/diagnostics.

The physical striped swatches and fallback timber use procedural material patterns, not decorative page grids. Small rounded image captions and material controls are functional exceptions to the general rectangular editorial layout.

## Detector and hook status

The coordinating agent completed one manual detector pass, saved in `docs/impeccable-detect.json`. Its navigation-underline width-transition finding has been corrected in source with a transform-based `scaleX` reveal. The saved result records the original finding; no second manual detector pass is claimed or required for this task.

The user authorized enabling Impeccable hooks, and hook configuration is enabled. Configuration is not evidence that an automatic hook executed. No automatic detector execution is asserted here.

## Verification boundary

The initial UI refinement passed `bun run typecheck` and `bun run lint` (20 files). A source scan found no remaining decorative eyebrow/section-number classes, Unicode arrow icon substitutes or tracking below -0.04em. Small 12px roles were confined to image captions, the fixed motion status and footer legal copy. The subsequent camera implementation passed `bun run typecheck` and source-scoped Biome (10 files). Its first full lint attempt found only formatting in the coordinating agent's detector JSON; root owns that formatting and the next complete check.

No camera browser pass or final-render acceptance is claimed by the implementation agent. The coordinating agent owns final render delivery, the production build, fresh browser captures, route/form/camera interactions, contrast/overflow checks, GPU checks and publication. Live verification of the refined release is also pending. Existing screenshots and first-release evidence are preserved and do not verify this source. Neither `RELEASE.md` nor `HANDOFF.md` has been rewritten during this documentation pass.

## Resumed refinement — 4 October 2026

A fresh root agent resumed this work from the cold handover. Read-only reviews against the official GSAP guidance were confirmed in a running page (Chrome with software WebGL, so the busy GPU was not used). These defects were real and are corrected:

- **A resize mid-pin reset the camera.** `invalidateOnRefresh` reverted the constant rail tween to 0 and fired its update: after a 10px width change at 60% of the passage, the camera, captions, meter and current view all fell back to Composition. The option is removed (the end function is re-evaluated anyway), `onRefresh` resynchronises, and revert-time renders are ignored. A width change now keeps 0.600 / The curve.
- **The motion switch dropped the visitor and the view.** The intended "keep the still view" branch read a trigger that had already been cleared, so the hero ended 1215px above the viewport and the camera returned to Composition. Pin state is now tracked through `onToggle`; the hero is restored and the current view held. A view chosen on a short screen also survives the motion switch, because the manual tween is no longer recorded in the context.
- **Hero controls below the fold.** The hero is a full viewport tall but starts below the 108px header, so at 1440×900 the finish names and view buttons were clipped by 32px. The controls are now positioned from the header height at each breakpoint and sit inside the first screen at 1440×900, 1280×800, 1024×768, 390×844 and 360×740. They also clear the fixed motion switch, which on phones steps aside (still focusable, shown on focus) while it would cover the finish labels.
- **Accessibility and resilience.** The h1 no longer leaves the accessibility tree mid-journey. View jumps are announced. The motion switch keeps one accessible name with `aria-pressed`. A lost WebGL context shows the material fallback and a restored one rebuilds the reflection map and returns the pin. Unmounting releases the GL context promptly. Per-frame diagnostic allocations are removed.

These interim probes are not release QA: they predate the final renders and build. The detector second pass is in [IMPECCABLE-DETECTOR.md](IMPECCABLE-DETECTOR.md).
