# STRATA refinement handover 4 October 2026

Production resumed on 4 October at William's request. The camera, accessibility and layout corrections are committed locally on `work/website` and described in [docs/IMPECCABLE-REFINEMENT.md](docs/IMPECCABLE-REFINEMENT.md); they are not yet published. Both STRATA final renders (their scene now carries rebuilt olive, cypress and shrub planting), packaging, final browser/camera QA and the public release are pending, waiting for the shared GPU. The first release below remains the historical verified delivery. See the collection's [refinement handoff](../../ARCHITECTURE-REFINEMENT-HANDOFF.md) for current state.

# First release — 3 October 2026

**Complete, public and live:** [STRATA](https://19-strata.williamking.workers.dev) · [source](https://github.com/WilliamHenryKing/19-strata). All 68 local browser checks and 14 live asset hashes passed; desktop and phone live checks were clean. Exact application commit, Cloudflare version, limits and maintenance commands are in [docs/RELEASE.md](docs/RELEASE.md). Documentation commits after this release do not change its application identity.

## Earlier implementation handoff (historical)

# STRATA implementation handoff — 3 October 2026

## Implemented

Home, filtered work index, three detailed projects, material library, studio/process and local brief. Original Three.js assemblage has four finishes, companion material/composition changes, bounded pointer response and demand rendering. Responsive layouts, mobile menu, navigation/footer and motion toggle. Fictional/generated disclosures. Native form validation, optional area/priorities, preview and text download; no contact fields, storage or sending endpoint. Hash history, titles, route focus, not-found, skip control and visible keyboard focus. DPR cap 1.65, visibility observers, reduced motion, resource disposal and CSS fallback.

## Implementation-agent checks

- `bun install`: succeeded with exact local dependencies and lockfile.
- `bun run typecheck`: passed after final source edits.
- `bun run format`: Biome passed after semantic-control fixes.
- Supplied images verified present. This is file verification, not rendered inspection by this agent.

Independent source-review corrections addressed before handoff: synchronous material query initialization for brief links; OS reduced-motion priority on load; distinct third project image; Three r186 PCFShadowMap compatibility. Back-to-beginning handles an already-active home route. Timber grooves follow material composition movement. Motion changes revert active GSAP entrances.

## Root verification and publication

Root must run build, inspect WebGL/images, exercise selections and page/form/navigation paths, verify mobile/reduced motion/fallback, and inspect console/accessibility. This implementation agent did not launch a server, build or browser, preserving sequential heavy jobs. Static checks do not establish visual acceptance or deployment.

Root holds the user's public GitHub/Cloudflare publication authorization and owns release after QA. Append actual URLs and evidence when complete.

## Initial browser corrections

Root's first browser captures revealed ejected sculpture pieces, narrow-screen CTA overflow and insufficient small-text contrast. The scene's first RAF timestamp could precede a performance.now capture: a negative delta amplified exponential damping. The corrected clock starts at 1/60, clamps subsequent deltas to 0–0.05 and keeps short observer wakes from truncating the intro. Diagnostics now exposes finite pose values for verification. Root measured the sole page-overflow offender as the invitation circle (right408.8 at390, right339.0 at320); its accompanying headline now scales to leave the circle within the flex row. Ink deepened to #34202a and hero word spacing increased. Type/lint checked; root must recapture and verify these visual/runtime fixes.

## Diagnostics and edits

`window.__STRATA_DIAGNOSTICS__`: `ready`, `fallback`, `frames`, `active`, `visible`, `material`, `motion`, `dpr`, `geometries`, `textures`, `drawCalls`, `triangles`, `disposed`. Settled scenes stop frames with `active: false`; pointer/resize/selection briefly wake rendering. Route exit disposes resources. Hidden/offscreen stops rendering. Motion-off renders explicit state changes once.

Keep IDs aligned in `src/data.ts`; map image types in `Picture` and supply both desktop/mobile variants. No CMS/backend. Finish-colour edits need contrast and rendered-light review. Original-thirteen renderer rules do not govern this commission.
