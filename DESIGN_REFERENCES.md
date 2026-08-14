# Design and implementation references

This file records the sites, repositories, documentation, and asset directories reviewed while building the portfolio. A reference means that a general interaction, layout, or visual principle was studied. It does not mean that source code or copyrighted assets were copied.

## Interactive portfolio references

| Reference | What was studied | How this portfolio differs |
| --- | --- | --- |
| [Bruno Simon](https://bruno-simon.com/) | Treating a 3D environment as the primary interface and making movement part of discovery | The earlier rover experiment was retired. The current room uses constrained orbit and direct object selection. |
| [Ida's Gameboy](https://idas-gameboy.netlify.app/) | Revealing portfolio content through a playful device interface | AFFAN_OS is an original desktop environment with original files, terminal behavior, layout, and visual design. |
| [Jesse Zhou](https://www.jesse-zhou.com/) | Fluid camera motion and transitions within one 3D experience | Camera paths, composition offsets, easing, and object files were implemented specifically for this room. |
| [Rachel Wei live portfolio](https://rachelqrwei.ca/use) | Compact open-front room composition, name-led text navigation beside the scene, warm personal objects, and a darker reflected room below the platform | This portfolio uses Affan's own room layout, content, models, palette, navigation labels, and interactions. |
| [Rachel Wei source repository](https://github.com/rachelqrwei/personalwebsite) | Named hitboxes paired with visible props, grouped hover feedback, a scene-loading gate, constrained orbit controls, and a tinted Three.js `Reflector` beneath the room | The repository has no included licence file. No code or assets were copied. This portfolio implements its own TypeScript scene, responsive reflection system, material hover treatment, object index, camera paths, and touch fallback. |
| [Perry Wang portfolio](https://perryw-2023.webflow.io/) and [information page](https://perryw-2023.webflow.io/info) | Editorial separation between selected work and personal information | This influenced an earlier layout that was later replaced by the current room-first experience. |

## Interface and rendering references

| Reference | What was studied | Implementation note |
| --- | --- | --- |
| [React Bits](https://reactbits.dev/get-started/introduction) | Small interaction feedback and motion restraint | The target cursor and click sparks are original local effects, disabled for touch-first and reduced-motion visitors. |
| [Three.js](https://threejs.org/) | Orbit controls, raycasting, glTF loading, physical materials, environment lighting, reflection helpers, and GPU point rendering | The scene is implemented directly in the portfolio's TypeScript code. |

## Model research and included assets

| Reference | Role in the project |
| --- | --- |
| [Three.js Resources model directory](https://threejsresources.com/category/models) | Directory used to find reputable free-model sources. |
| [Three.js Resources 3D-assets directory](https://threejsresources.com/tool/3d-assets) | Directory used to compare asset tools, libraries, and formats. |
| [Poly Haven](https://polyhaven.com/) | Source of the five included CC0 1K glTF models. Their geometry is retained while the room applies its own simplified flat materials. See `THIRD_PARTY_ASSETS.md`. |
| [TurboSquid free furnishings](https://www.turbosquid.com/Search/3D-Models/furnishings?max_price=0) | Reviewed during research. No TurboSquid model is included. |
| [Project by abhayexe on Sketchfab](https://sketchfab.com/3d-models/project-793e99898ff14f2a89c73a3ccb5d7d10) | Visual direction for a warmer creative workspace. The model is not downloadable and no geometry or textures were copied. |

## Ownership and licences

- All portfolio code, custom models, written content, AFFAN_OS screens, camera behavior, navigation, and interaction logic are original to this project.
- The only included external 3D assets are the Poly Haven models listed in `THIRD_PARTY_ASSETS.md` under CC0.
- No music, images, models, or source code from the portfolio-reference sites are redistributed here.
