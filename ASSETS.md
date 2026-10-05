# Asset provenance

All runtime assets are local. No hotlinked imagery, remote fonts or third-party embeds.

| Asset | Provenance | Use |
| --- | --- | --- |
| `public/images/strata-interior.webp` / `strata-interior-mobile.webp` | Original ImageGen output, root, 3 October 2026. Fictional terracotta salon, burgundy seating, travertine and timber. 1536×1024 / 768×512 optimized images. | Courtyard House and studio. |
| `public/images/strata-gather.webp` / `strata-gather-mobile.webp` | Original ImageGen output, root, 3 October 2026. Fictional rust-plaster restaurant with walnut, pale stone and brushed aluminium. | A Place to Gather. |
| `public/images/strata-workspace.webp` / `strata-workspace-mobile.webp` | Original ImageGen output, root, 3 October 2026. Fictional creative workspace with travertine, walnut storage, clay and metal. | The Quiet Corner. |
| `public/fonts/manrope-latin.woff2` | Independent copy of 17 SIGNAL's local Manrope. SIL Open Font License 1.1, included as `OFL-Manrope.txt`. | Self-hosted variable typography. |
| `public/favicon.svg` | Original code-authored geometric mark. | Browser icon. |
| Sculpture/textures in `src/MaterialScene.tsx` | Original parametric meshes and deterministically seeded CanvasTextures. No imported models or texture packs. | Hero/library. |
| CSS samples/fallback in `src/styles.css` | Original gradients and geometric artwork. | Controls, boards and fallback. |
| RoomEnvironment | Official Three.js addon under its MIT licence; no remote HDRI. | Lighting. |

Images illustrate fictional concepts, not photographs of completed commissions. Generated status is disclosed. Third-party fonts retain their included licence; other creative assets were generated/authored for this commission.

<!-- BEGIN ARCHITECTURE WORLD RENDERS -->
## Original Blender architectural worlds — 3 October 2026

| Delivery files in `public/images/` | Source composition |
| --- | --- |
| `strata-world.webp`, `strata-world-mobile.webp` | Wide view of the authored full-scale architectural world |
| `strata-material-study.webp`, `strata-material-study-mobile.webp` | Material/detail view of the same world |

These are locally rendered fictional Blender scenes. Geometry, placement, cameras and light composition are authored for this portfolio; photographed PBR maps and the environment are [Poly Haven CC0 assets](https://polyhaven.com/license), with the exact authors, download URLs and SHA-256 hashes in `assets/source/texture-manifest.json`. The editable packed source is `assets/source/architecture-world.blend`; project-local reconstruction tools and the used-asset attribution table are documented in [RENDERING.md](docs/RENDERING.md).

Settled throw geometry is preserved in `tools/worlds/cloth/strata.json`, together with its recorded gravity/cloth-bake metadata. The editable simulation study is `assets/source/cloth-study.blend` and the reconstruction script is `tools/bake-cloth.py`. Cloth simulation is separate from CUDA image rendering. The external simulation cache is not included by this packaging step; the settled JSON and editable setup are included. See `docs/render/cloth.json` and the cache boundary in `docs/RENDERING.md`.

The final Cycles frames were rendered at 3200 × 2000 with CUDA GPU compute and OptiX denoising. Actual settings and machine-guard records are in `docs/render/`. Surface UV crops, recolouring and straight-through glass shadow transport are documented rendering adaptations. WebP encoding, website integration and browser/live verification are separate from source packaging. No claim of completed architecture, photographic capture or user acceptance is made. All earlier generated and licensed image provenance above remains applicable to those older files.
<!-- END ARCHITECTURE WORLD RENDERS -->
