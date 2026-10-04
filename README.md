# STRATA

## Website and source

[Live website](https://19-strata.williamking.workers.dev) · [Public source](https://github.com/WilliamHenryKing/19-strata) · [Verification](docs/VERIFICATION.md) · [Release](docs/RELEASE.md)

![Desktop homepage](docs/media/desktop.webp)

An independent fictional architecture, interiors and finishing portfolio. React, TypeScript, Three.js, GSAP, Vite and Tailwind. Clay-and-plum editorial design with an original interactive material sculpture, three project studies and a local brief builder.

The links, screenshots and release evidence above document the first publication. The current refinement adds cinematic camera travel and an architectural render gallery. Final render delivery, fresh browser verification and live verification of this refinement remain pending; earlier release evidence does not verify these additions.

## Develop and verify

```powershell
bun install --frozen-lockfile
bun run dev
bun run typecheck
bun run lint
bun run build
bun run preview
```

Development is loopback-only at `http://127.0.0.1:4529`, strict port. Preview uses `4629`. Exact local dependencies are pinned; no shared runtime imports or external font/image requests. Coordinate resource-heavy jobs with the collection root. Root owns authorized public GitHub/Cloudflare deployment.

## Edit

| File | Purpose |
| --- | --- |
| `src/data.ts` | Materials, project stories and process copy |
| `src/App.tsx` | Routes, navigation, pages and local brief |
| `src/MaterialScene.tsx` | Original geometry, textures, lighting, camera position/look-target paths, resource cleanup and diagnostics |
| `src/useMaterialJourney.ts` | ScrollTrigger camera progress, view buttons, skip/focus, responsive and reduced-motion behavior |
| `src/styles.css`, `src/refinements.css`, `src/journey.css` | Base design, refined type/layout, camera-stage composition and fallback |
| `src/Icon.tsx` | Authored stroke SVG icon family; no emoji or glyph icons |
| `src/WorldGallery.tsx` | Space/detail view selector for the separately rendered architectural world |
| `public/images/` | Local optimized interiors and architectural render assets |
| `ASSETS.md` | Asset provenance and font licence |

Routes: `#/`, `#/work`, `#/work/the-courtyard-house`, `#/work/a-place-to-gather`, `#/work/the-quiet-corner`, `#/materials`, `#/materials/walnut`, `#/studio`, `#/brief`. A material-start brief link uses `#/brief?material=clay`.

The brief form previews and downloads a UTF-8 text file on the current device. No server, sending endpoint, contact field, analytics or form-data storage. Only the animation preference uses localStorage (`strata-motion`).

Read `DESIGN.md` for direction and `HANDOFF.md` for verification. Fictional concepts and generated imagery are not evidence of real commissions.

## Interactive study

![Original Three.js architectural study](docs/media/interaction.webp)

The current home hero moves an actual Three.js perspective camera and its look target along independent Catmull-Rom curves. Native scroll drives GSAP ScrollTrigger progress through **Composition**, **The curve** and **The grain**. The same view buttons work with keyboard or touch, and **Skip to projects** moves to and focuses the project heading. Material selection remains live throughout the sequence.

Pinning is enabled only with motion on, no OS reduced-motion preference and a viewport at least 740px high. Shorter viewports use button-driven travel; reduced motion and the motion-off setting use instant view cuts without pinning. The compact materials-page sculpture retains its orthographic camera. WebGL failure displays the existing still fallback and disables camera controls. Rendering remains bounded, pauses offscreen or in hidden tabs, and disposes resources on unmount.

`window.__STRATA_DIAGNOSTICS__.camera` reports `position`, `target`, `progress` and `projection`, alongside the existing frame/resource counters. These are inspection hooks, not proof of visual quality or performance on an untested device.

The home world gallery switches between `/images/strata-world.webp` and `/images/strata-material-study.webp`, with mobile variants. Those images come from a separate authored Blender architectural world; the lightweight interactive sculpture is not that room rendered in real time. The coordinating renderer will deliver the final assets and `RENDERING.md` provenance record.

## Refinement guidance

The seven installed official GSAP skills are pinned to commit `aed9cfd3277740755f6bfc1155c7aa645403b760`: core, timeline, ScrollTrigger, React, performance, plugins and utilities. This is the guidance-source pin; runtime dependency versions remain in `package.json` and `bun.lock`. The implementation uses `useGSAP`, ScrollTrigger, ScrollToPlugin and GSAP utilities; it does not require every plugin described by those skills.

See [the refinement record](docs/IMPECCABLE-REFINEMENT.md) for Impeccable guidance, the completed single manual detector pass, and the boundary between implemented behavior and pending review.
