# STRATA — spaces, surfaces, substance

## Direction

A finishing-led architecture and interiors concept atelier. Tactile, warm and graphic: clay/rust, pale putty, deep plum; composed Manrope typography and precise rules. A material workshop with editorial composition, distinct from STILLFORM's beige photo journal and AUREL's dark cinema. Headings carry their own hierarchy without decorative kickers or section numbers. Display tracking stops at -0.04em, primary body text is 16px, and supporting labels are generally 14px. The large footer wordmark is a deliberate brand composition, not a content heading.

“Good spaces. Great surfaces.” Choosing travertine, clay plaster, smoked walnut or brushed aluminium changes the main arch, companion finishes, sculptural arrangement and surrounding colour. Original bevelled arch geometry, rounded slabs, fluted timber, a drum and reflective sphere create an architectural assemblage. RoomEnvironment supplies soft reflections; directional light grounds the sculpture. Seeded CanvasTextures are original code.

## Pages and interactions

- Home: cinematic interactive sculpture, approach, selected concepts, a space/detail architectural render gallery and brief invitation.
- Work: category filters and three fictional studies.
- Project: design question/response, scope, palette, next project.
- Materials: interactive sculpture, finish character, applications and considerations.
- Studio: design position, four-stage process, image-led closing.
- Brief: native validation, local preview and text download; no sending/backend claim.

Hash routes preserve browser history, resolve links, update titles and main-content focus. Unknown routes have recovery. Copy is editable in `src/data.ts` and `src/App.tsx`.

## Motion and resources

The hero is the authored motion focal point. A brief partial headline mask introduces the composition; native scroll then takes a real perspective camera around the arch and closer to the timber and metal. Independent Catmull-Rom position and look-target paths preserve a deliberate view of the material assembly. GSAP ScrollTrigger controls one progress scalar with a 0.7-second scrub; the renderer samples the curves without per-frame React rendering. Editorial captions and a thin progress line support the camera sequence. Other routes arrive directly; changing a material uses a short opacity response for the details panel.

Three view buttons expose Composition, The curve and The grain. Skip to projects uses ScrollToPlugin and focuses the project heading. Pinning requires motion on, no OS reduced-motion preference and viewport height of at least 740px. Shorter viewports use button-driven camera travel. Reduced motion and motion off provide immediate, user-selected view cuts with no pinning. Portrait framing adds camera distance and places the controls below the scene. The materials page retains its compact orthographic composition.

Scoped `useGSAP`/matchMedia cleanup reverts the pin and associated tweens. The rail tween is not invalidated on refresh, so a resize mid-pin keeps the camera, captions and meter where the scroll is; revert-time renders are ignored. Removing the pin mid-passage (motion switch, OS preference, height change) returns the visitor to the hero and holds the current view. View and skip tweens live outside the context, so a revert cannot rewind them. The page heading stays in the accessibility tree while it fades for the camera; only its link leaves the tab order. View jumps are announced politely. The hero controls sit above the fold at every header size, and on phones the fixed motion switch steps aside (still focusable) while they are on screen. Sculpture transitions and pointer response remain bounded; rendering idles after settling. IntersectionObserver and page visibility pause rendering. DPR is capped at 1.65, one 1024px shadow map, no post-processing. OS reduced motion starts still even with an old saved on preference. Still mode retains short color/opacity feedback while removing image zoom and icon travel. Disposal covers geometries, materials, textures, environment target, shadow, renderer, observers and listeners. WebGL failure/loss exposes the CSS material fallback, removes pinning and disables view buttons. Diagnostics include the camera position, target, progress and projection in addition to render/resource counters.

The rendered atelier gallery is a separate visual medium. Its wide and detail images come from an authored Blender room with real-scale joinery, clay arcades and a planted courtyard. Do not imply that the interactive hero traverses that Blender room. The gallery supports the material story while the runtime scene remains an original lightweight sculptural study.

Native scrolling, keyboard controls, visible focus, labelled fields, route focus, and a mobile disclosure menu with Escape support. No fabricated clients, awards, locations, contacts or completed-project claims. Generated imagery and fictional status are disclosed.

One authored stroke SVG icon family supports navigation and state feedback. No emojis or Unicode icon substitutes. The project brief remains a local preview/download; navigation names that action explicitly. Small screens place heading, scene and controls vertically, with a compact text-link invitation instead of squeezing the circular desktop CTA beside the heading.

## Guidance provenance

The seven official GSAP skills (core, timeline, ScrollTrigger, React, performance, plugins and utilities) are installed at the pinned source commit `aed9cfd3277740755f6bfc1155c7aa645403b760`. This identifies the development guidance, not a runtime GSAP version. Impeccable's complete skill and 24 command references informed the refinement. Its single manual detector pass identified a navigation underline width transition, now replaced with `scaleX`. Hook configuration is enabled with user authorization; automatic hook execution is not asserted without execution evidence.

## Verification boundary

The first published release remains documented in its existing evidence. The current camera implementation passed TypeScript and source-scoped Biome checks; those checks do not establish visual acceptance. Final render delivery, fresh browser/GPU/responsive checks and live verification of this refinement remain pending. Root coordinates those jobs and publication separately.
