# Change contract template

Copy this section into the issue, task notes, or PR before a consequential app edit.

- Request and observable behavior:
- Active repository / branch / commit / deployed entry:
- Affected files and components:
- Preserved behavior and user data:
- Governing rule IDs and any conflict:
- Required dependency outside scope (resolve before editing):
- Unresolved choice and smallest question, if any:
- Test fixtures, independent expected values, and visual reference:
- Deployment target and whether this task authorizes it:

| Criterion | Exact action and expected state/render/saved effect | Verification method | Result |
| --- | --- | --- | --- |
| AC-1 |  |  | PENDING |

Use PASS, FAIL, or NOT TESTED in the final report. A code diff alone is not a PASS for an interaction.

## Room POV, sync, and drawer bank (2026-09-24)

- Request: verify room-facing fronts and 3D boundaries, correct mini drawer and shelf bank behavior, synchronize Room Layout and Closet Builder with dated recovery, add one linked plan/POV camera, resize existing runs when their wall changes, and select section builds through icons in Properties.
- Baseline: `danesfarmer-hash/space-organization-room-layout`, `main` at `b14352fdfd2cc6b0a14b7c37bf16a5f23456ab19`; Pages serves `index.html` with embedded Room and Closet payloads; live `index.html` SHA-256 `809fe459c87da3394bf4f5c752d7c12b956c46d22bd7ae831b2c8e17eb4d20b7`.
- Affected: embedded Closet Builder model/rendering and Properties; suite handoff/project recovery UI; focused tests. `index.html` remains the single active build owner.
- Preserve: unrelated toolbar icons, styles, saved named revisions, existing projects, and standalone HTML files. Existing records are extended compatibly.
- Rules: G-01–G-05, C-01–C-13, R-01, P-01–P-03, and current Global Rules. The construction rules supersede a universal drawer deduction or corner filler minimum.
- Unresolved: no selected drawer slide/front hardware catalog or measured hardware clearances is stored. Current `DEFAULTS` are generic placeholders; 32 mm pitch can be checked, but production hardware fit cannot be certified. Hinge hand and exact door swing remain U-02; retain existing hand while correcting room-facing normals.
- Deployment: the later user request explicitly authorized testing and publication. `main` contains the app update; the local working branch is `work/room-pov-sync`.

| Criterion | Expected observable effect | Method | Result |
| --- | --- | --- | --- |
| 1 | Fronts extend into room on all wall normals; model bounds and 3D occlusion agree from both sides. | Mirrored geometry and interactive view checks | NOT TESTED: visual two-direction comparison unavailable |
| 2 | Mini drawer recomputes 32 mm bank and rejects a bank that cannot fit. | Model fixtures, UI, save/reload | NOT TESTED: model fixtures pass; UI and reload unavailable |
| 3 | Bottom/top bound the bank; no internal/below shelf; upper shelves use remaining zone. | Generated/manual/saved fixtures and views | NOT TESTED: generated model fixtures pass; saved and visual cases unavailable |
| 4 | Changed room syncs without named save; one day/time recovery per distinct state; valid end-anchored runs resize to their changed wall while keeping section IDs and locked widths; impossible fits remain and are flagged. | Toggle/reload/recover/undo and grow/shrink fixtures | NOT TESTED: recovery and fit model fixtures pass; interactive workflow unavailable |
| 5 | One camera drives plan marker and POV hold arrows, respects collision, persists, and renders saved construction. | Mouse/touch hold, bounds, reload, view comparison | NOT TESTED: collision and depth model fixtures pass; interactive controls unavailable |
| 6 | Properties offers labeled type icons for open, shelves, hanging, drawers, doors, and shoes. Choosing an icon rebuilds the selected section and persists that build. | Icon clicks, selection state, save/reload | NOT TESTED: build model fixture passes; UI and reload unavailable |

Verification was updated in `docs/RELEASE_REPORT_2026-09-24.md` after browser publication.

## POV drag and image clarity (2026-09-24)

- Baseline: `main` `40d61d0cbf2154eaa9d801c5f7638d85694fa5e9`; Pages entry `index.html` SHA-256 `934db817fd5eee27e3b26ed84a69c5fd9047edc99e70438d1e57f4c5359f8366`.
- Affected: embedded Closet Builder POV canvas pointer controls, camera pitch persistence, and software raster shading/resolution. Preserve the plan marker and arrow controls, camera collision, room/closet geometry, saved projects, other views, and unrelated UI.
- Rules: G-01–G-05, C-04, C-05, C-13, P-02/P-03. The attached UX session has repeated POV canvas clicks and arrow use but no canvas camera reaction.
- Acceptance: (1) dragging POV turns and tilts the *same* plan-linked camera; Shift-drag pans its floor position with collision and no object edits; pointer release/cancel ends it. (2) a short click selects the nearest visible section and opens its editable Properties; Alt-click selects a visible child item. Opaque panels block selection behind them. (3) keyboard arrows move/turn continuously until release on desktop, with on-screen arrows retained for touch; plan marker still synchronizes, saves, and restores; keyboard input fields retain normal arrow behavior. (4) the canvas uses its displayed aspect ratio with a bounded high-resolution backing buffer, depth-tested opaque geometry, flat ceiling from the room footprint, saved ceiling-light fixtures, directional lighting and visible face edges. (5) both front and back views hide geometry behind panels; no geometry changes or unrelated UI changes.
- Verification: targeted camera/raster unit fixtures; desktop pointer drag and arrow smoke test, reload, both 3D directions, touch-sized viewport and diff review. Unknown material light reflectance is a rendering approximation, not a production finish claim.

## Room Layout axis and direct dimensions (2026-09-24)

- Request: wall-body drags move only along their own tangent; wall length numbers and room vertices are direct selectable drag targets.
- Baseline: `danesfarmer-hash/space-organization-room-layout`, `main` `42fe5e2a95e8bd1349e5366d12462d8b59d158f3`, Pages entry `index.html` SHA-256 `48d8de0ddfc4c77985ab7742e4bf74057e6de79d1cdbde04b35305d18913ad02`.
- Affected: embedded Room Layout wall drag, dimension label pointer behavior, vertex handles and guidance; focused tests. Preserve room items, door/window ownership, plan pan, double-click exact dimension editing, saved projects, Closet Builder payload and unrelated UI.
- Rules: G-01–G-05, R-01–R-03, R-05, P-02/P-03. Existing code already projects wall translations onto their tangent; the dimension label currently only repositions its annotation.
- Acceptance: AC-1 dragging a wall along its tangent moves its endpoint pair with no perpendicular drift; perpendicular-only movement does not create an edit or undo step. AC-2 dragging its length value along the wall changes the displayed and saved length on the 1/16 in edit grid, with split bounds and linked rectangle behavior retained; perpendicular-only movement does not resize it. AC-3 visible room vertices select and drag with the existing corner and split-point constraints; drag is one undo step, click is not. AC-4 wall-hosted objects retain hit priority and plan pan, exact input, save/reload, and Closet Builder room handoff still work.
- Verification: numeric horizontal/vertical/diagonal fixture and desktop browser gestures, undo/redo, dimension input, save/reload, module switch. Deployment to Pages is authorized by the standing user request to publish updates unless blocked by a critical error.

| Criterion | Exact action and expected state/render/saved effect | Verification method | Result |
| --- | --- | --- | --- |
| AC-1 | Wall follows tangent; perpendicular gesture changes nothing. | Numeric fixtures and live plan drags | PASS: perpendicular drag retained 59 15/16″; axial drag moved top endpoints and yielded 60″. |
| AC-2 | Length text drag drives geometry and label without perpendicular resizing. | Live label drags, undo and reload | PASS: 54″ became 59 15/16″ with linked opposite wall; perpendicular label drag made no edit; three undos restored 54″ after reload. |
| AC-3 | Vertex click selects and drag changes its point under constraints. | Live drag and undo | PASS: Point 3 selected and moved, changing connected wall lengths; undo restored the rectangle. |
| AC-4 | Other target priority, exact editing, pan and room handoff persist. | Browser smoke and diff | NOT TESTED: Closet Builder handoff showed restored 54″ room and reload retained it; hosted-object priority, double-click input and pan were not exercised. |

## POV diagonal navigation and rendering deployment (2026-09-24)

- Request: deploy the cleaner POV rendering plan and make held keyboard arrows behave like a walk/look control. Up + Right walks forward while strafing right; Down + Left walks backward while strafing left. Shift turns the same arrow combinations into head look: Up + Right looks up and right, Down + Left looks down and left.
- Active repository: `danesfarmer-hash/space-organization-room-layout`, `main`, baseline `d01531505b6f648dedb2d9afee7837059aed1e83`; deployed entry `index.html` with embedded `CLOSET_B64`.
- Affected: embedded Closet Builder POV keyboard loop, pure navigation intent helper, POV raster backing density, and focused tests. Standalone module files are preserved.
- Preserved: collision checks, saved viewer camera, pointer drag look/pan, touch arrows, section picking, room geometry, other views, and saved project data.
- Rules: G-01–G-05, C-04, C-05, C-13, P-02/P-03; latest user instruction controls diagonal head look semantics.
- Rendering deployment: the active build already contains the cleaner POV raster pipeline with perspective projection, depth-tested opaque faces, room floor/flat ceiling, directional face lighting, visible edges, collision-aware camera, and bounded high-resolution backing. This change deploys that active pipeline together with the navigation update and raises the supersampling ceiling from 1.6× to 2× while retaining the 950,000-pixel safety cap.
- Deployment: user explicitly requested deployment in this turn.

| Criterion | Exact action and expected effect | Verification | Result |
| --- | --- | --- | --- |
| AC-1 | Hold Arrow Up + Right in POV: normalized forward walk plus right strafe, with collision-safe sliding. | Pure intent fixture; browser hold test | PASS: intent fixture; browser hold test NOT TESTED before deployment |
| AC-2 | Hold Arrow Down + Left in POV: normalized backward walk plus left strafe. | Pure intent fixture; browser hold test | PASS: intent fixture; browser hold test NOT TESTED before deployment |
| AC-3 | Hold Shift + Up + Right: pitch up and yaw right together; Shift + Down + Left: pitch down and yaw left together. | Pure intent fixture; browser hold test | PASS: both diagonal look fixtures; browser hold test NOT TESTED before deployment |
| AC-4 | Cleaner POV rendering remains active with bounded supersampling and depth/occlusion pipeline. | Embedded payload check, raster tests, syntax check | PASS: embedded `renderPOV`, depth, ceiling, aspect, and 950,000-pixel tests pass |
| AC-5 | Existing construction, collision, persistence, and room handoff tests remain passing. | `npm test` | PASS: 23/23 |

## POV trackpad zoom (2026-09-24)

- Request: in Closet Builder POV, a two-finger trackpad drag must zoom the view in and out without moving the camera or editing geometry.
- Active build: `index.html` remains the deployed entry point with the embedded Closet Builder payload. Preserve keyboard walk/look, pointer look/pan, collision, section picking, flat ceiling, depth-tested raster rendering, and saved camera state.
- Implementation: route POV canvas wheel events (the browser event produced by a two-finger trackpad scroll) to a bounded perspective-scale control, with a visible hint in the POV overlay.
- Verification: pure zoom helper fixture, syntax check, full `npm test`, and live browser walkthrough on a saved room/run.

| Criterion | Exact action and expected effect | Verification | Result |
| --- | --- | --- | --- |
| AC-1 | Two-finger drag up/down over POV zooms in/out, preserving camera position and geometry. | Zoom helper fixture and live wheel event | PENDING |
| AC-2 | Zoom remains bounded and does not affect plan/elevation zoom state. | Clamp fixture and view switch smoke test | PENDING |
| AC-3 | Existing POV navigation, selection, and construction tests remain passing. | `npm test` | PENDING |

## POV GPU scene replacement (2026-09-24)

- Request: replace the software POV projection with a real eye-level 3D scene using perspective projection and a depth buffer; preserve construction geometry, section IDs, picking, navigation, collision, persistence, and trackpad zoom.
- Implementation: the deployed entry keeps the existing model generators, but sends their physically thick faces to a native WebGL scene with a perspective camera, GPU depth testing, directional/ceiling fill lighting, sRGB tone mapping, and a high-resolution still capture path. A 2D raster fallback remains for browsers without WebGL. CPU projection is retained only for section/item picking, not the displayed image.
- Still mode: the POV `STILL` control temporarily raises the backing resolution and downloads a PNG without changing the saved camera or model.

| AC-1 | POV uses a perspective GPU scene with depth-tested opaque faces; shelves and partitions cannot render through nearer opaque panels. | Embedded shader/depth markers, live browser POV, view comparison | PENDING |
| AC-2 | Camera pitch/yaw, walk/strafe, collision, saved camera, section/item picking, and trackpad zoom remain compatible with the new renderer. | Existing focused tests plus live walkthrough | PENDING |
| AC-3 | Still mode produces a higher-resolution PNG while leaving the interactive camera responsive and unchanged. | UI smoke and captured image dimensions | PENDING |
| AC-4 | Existing construction and room-sync behavior remains passing. | `npm test`, syntax check, diff review | PENDING |

## POV single-click drawer opening correction (2026-09-25)

- Request: a single click on a visible drawer front in Closet Builder POV must open that drawer front and reveal the physical drawer box/interior; clicking again closes it.
- Active repository: `danesfarmer-hash/space-organization-room-layout`, `main`; Pages entry remains `index.html` with the embedded Closet Builder payload and the external POV interaction patch.
- Affected: `pov-webgl.js` embedded-frame click bridge and focused POV drawer tests. The prior bridge referenced iframe-local lexical helpers (`$`, `state`, and unqualified picking) from a separately injected script, so the visible click did not reliably mutate the drawer model.
- Preserve: room-facing drawer travel, actual drawer-box geometry, depth-tested/occluded picking, section selection/editing, keyboard/trackpad POV controls, all existing project data, and unrelated UI.
- Governing rules: G-01–G-05, C-04, C-05, C-13, C-12, P-02/P-03. Drawer fronts must bump outward, never inward; opening must move the physical box/front rather than a decorative-only state.
- Deployment: the user explicitly requested correction and publication.

| Criterion | Exact action and expected effect | Verification method | Result |
| --- | --- | --- | --- |
| AC-1 | One click on the nearest visible drawer front reaches the embedded model without Alt and toggles the drawer state. | Focused bridge test plus live disposable drawer fixture | PENDING |
| AC-2 | Opening sets physical outward extension and renders the real drawer box parts; closing returns the front and box to the cabinet. | `drawerPresentation` fixture and source geometry assertion; live screenshot | PENDING |
| AC-3 | Hidden drawers remain unclickable through opaque partitions; visible section behavior remains unchanged. | Existing depth/picking fixture and live POV click path | PENDING |
| AC-4 | Existing construction and POV/navigation tests remain passing. | `npm test`, syntax check, diff review | PENDING |

## Overlay and filler geometry contract (2026-09-24)

- Request: use one physical geometry contract for drawer/door overlays and corner fillers across Closet Builder, AI Builder, plan, elevation, POV, save/load, undo, and redo. Half overlay stops 2 mm from a shared partition centerline; full overlay stops 4 mm from an outside panel edge; fillers contain only KT, KB, and their toe kick.
- Active repository: `danesfarmer-hash/space-organization-room-layout`, `main`; `index.html` is the deployed embedded build owner.
- Affected: embedded Closet Builder geometry helpers, elevation/POV construction solids, filler renderers, save/load and history revalidation, and geometry tests. Preserve run placement, section sizing, corner ownership, drawer/door opening behavior, and existing saved records.
- Governing rules: G-01–G-05, C-01–C-13, especially C-05, C-06, C-09, C-11, C-12, C-13, P-02/P-03. The new overlay/filler requirements are explicit user corrections and take precedence over the prior visual-offset implementation.
- Deployment: user requested implementation and publication after tests pass.

| Criterion | Expected observable effect | Method | Result |
| --- | --- | --- | --- |
| Overlay formulas | Half = t/2 − 2 mm; full = t − 4 mm; no centerline crossing; 4 mm shared gap. | Pure active-build fixtures | PASS |
| Shared front geometry | Elevation, 3D/POV, and saved dimensions use `frontGeometry` from physical panel bounds. | Source contract and render-path fixtures | PASS |
| Drawer/door opening | Front dimensions remain fixed while drawer box/door opening geometry moves independently. | POV drawer, presentation, and geometry fixtures | PASS |
| Filler solids | Filler emits only KT, KB, and toe kick; no full face panel. | Filler-part and renderer fixtures | PASS |
| Solid intersections | OBB-based 3D validation reports unintended volume intersections and tolerates boundary contact. | Construction fixture with injected shelf/drawer collision | PASS |
| Revalidation | Commit, undo, redo, save, and load refresh geometry validation. | Embedded source checks and regression suite | PASS |
| Regression | Existing run placement, corners, section sizing, bank, POV, and persistence tests remain passing. | `npm test` | PASS |

## POV lighting and drawer regression (2026-09-25)

- Request: keep the POV well lit without placed fixtures; add image controls to Properties; restore drawer opening on direct POV clicks.
- Active source: `danesfarmer-hash/space-organization-room-layout`, `main` at `83ea52c5926de3494f8335112a70cc73cc8d002a`; Pages entry is `index.html`, which embeds the active Closet Builder. The standalone builder is historical and is not changed.
- Affected: embedded Closet Builder lighting shader/software fallback, POV Properties, direct click handler; targeted tests, rulebook, release records.
- Preserve: project model, front travel, camera navigation, depth-based occlusion, unrelated controls, room module, saved records. POV image settings use a separate device-local preference key.
- Governing rules: G-01–G-05, C-04/C-05/C-13, P-02/P-03, V-01–V-03. No material geometry choice is unresolved.
- Fixture: empty-fixture 120 × 96 in room with a 24 in drawer section. A visible front click opens/closes the same drawer, while a front hidden behind opaque geometry cannot be selected. Compare default and controls for white and dark material. Reload preference without changing project data.
- Deployment target: GitHub Pages from `main`; user requested an app update, with prior publishing authorization in the session.

| Criterion | Exact action and expected effect | Verification | Result |
| --- | --- | --- | --- |
| AC-1 | No ceiling fixtures still gives legible cabinet faces in POV on GPU and fallback renderer. | Shader/fallback fixture and browser image | NOT TESTED: fallback brightness fixture passes; GPU image not viewed |
| AC-2 | POV Properties adjusts brightness, ambient light, shadows, contrast, warmth, and quality live; defaults and reset work after reload. | DOM/browser and preference readback | NOT TESTED: controls and binding in active payload; browser/reload not run |
| AC-3 | Single visible drawer click opens and closes actual front and box; occluded face cannot be clicked; camera drag stays separate. | Integrated click fixture and browser smoke | NOT TESTED: active handler and depth fixtures pass; browser smoke not run |
| AC-4 | No project geometry changes; other views, navigation, and saved projects remain stable. | Diff, `npm test`, browser workflow | NOT TESTED: diff and 37/37 tests pass; browser workflow not run |

## Ideal POV default refinement (2026-09-25)

- Starting published commit: `b26145dff6a55bc508bcae1736897825e0d1d808` on `main`; Rules checks and Pages deployment succeeded. In a 1363 × 937 Chrome cloud browser, the walkthrough fixture showed the controls, but white surfaces were visually washed out at the initial Bright studio values.
- Scope: make Ideal the named initial/reset preset; use balanced exposure, ambient fill, shadow depth, contrast, warmth, and high image quality. Keep Bright, Soft, and Dramatic as alternatives. Sliders and quality switch to Custom. High quality must visibly supersample at device pixel ratio 1 within a bounded pixel cap.
- Preserve: project geometry, local project records, POV drawer action, camera, existing explicit image preferences, unrelated UI.
- Rules: G-01–G-05, V-01–V-03; no geometry change.
- Acceptance: new preference state displays Ideal selected with 100% brightness, 58% ambient, 45% shadows, 108% contrast, slight warmth, and High quality; Reset restores it; changing a control marks Custom; high quality exceeds native resolution on a 1× display without exceeding 1.8 million pixels; no-fixture closet remains legible. Browser visual review of the published revision is required before a full visual PASS claim.

## Restore the 6:42 PM published app (2026-09-24 Chicago)

- Request: restore the working app from around 7:15 PM, before the later changes. The latest published commit before that time is `b2dfd9d` at 6:42:39 PM CDT.
- Starting `main`: `712bf74` at 10:18 PM CDT. GitHub Pages serves `index.html`; the embedded Room Layout and Closet Builder are its active app. Restore the active entry and its two subsequently changed test files exactly from `b2dfd9d`. Keep historical rule/contract/report text for traceability and add this superseding rollback record. Do not change customer project storage.
- Governing rules: G-01, G-02, G-03, G-05, O-01. The newer feature contracts remain historical records; their post-7:15 app implementations are withdrawn by this restore.

| Criterion | Verification | Result |
| --- | --- | --- |
| Active app matches 6:42 PM release byte for byte | Compare `index.html` Git blob with `b2dfd9d:index.html` | PASS locally |
| Newer app code is absent; historical later commits remain recoverable | Inspect source diff and history | PASS locally |
| Baseline automated regression suite passes | `npm test` | PASS locally: 24/24 |
| GitHub Pages serves the restored app | Push and confirm deployment | PENDING |

## Local Closet Builder toolbar, part selection, and filler correction (2026-09-24)

- Request: move POV image controls to a draggable, resizable, closeable Lighting window opened from the toolbar; add a separate Tools window to run tools and show/hide their toolbar buttons; click and delete individual editable closet items; remove the repeatedly generated full-height filler face.
- Active repository / branch / commit / entry: `danesfarmer-hash/space-organization-room-layout`, local checkout of `main` at `45c456827c1a1ccc78a581aed2ab16d94945a993`; GitHub Pages entry `index.html` embeds `CLOSET_B64`. Work is local only. The standalone `closet-builder.html` is not the active build owner.
- Affected: embedded Closet Builder payload in `index.html`, targeted geometry/POV tests, this contract and rulebook. Preserve Room Layout payload, saved projects, icon graphics, camera controls, drawer/door opening behavior, and existing construction geometry beyond the filler pieces.
- Rules: G-01–G-05, C-01–C-13, V-01/V-03. Latest instruction moves V-02 from Properties to Lighting. New C-14 and V-04 below. Shared structural partitions remain run-owned; the Parts mode targets items with editable model identity, not a free deletion of shared partition geometry.
- Baseline evidence: three generated corners (bottom owner depth 16, mirrored left owner depth 12, bottom owner depth 24) each produced KB, KT, and an 84-inch tall, 3/4-inch deep `data-filler-face` box. This is a renderer path defect, not an inference from an image.
- Deployment: user authorized a push after reviewing the local candidate on 2026-09-24 Chicago. Browser visual and reload checks remain unverified and must be reported as such.

| Criterion | Expected observable effect | Verification | Result |
| --- | --- | --- | --- |
| AC-1 | Lighting and Tools open independently as draggable, resizable, closeable windows; presets/controls change POV image without altering geometry. | Syntax, browser interaction, reload | NOT TESTED: script parses and Ideal matches the restored face color; live windows, resize, appearance, and reload were not exercised. |
| AC-2 | Hiding a shortcut leaves the tool callable from Tools; Show all and Reset recover hidden buttons; selection and Tools remain accessible. | Browser interaction, reload | NOT TESTED: catalog and persistence paths are present; live hide/recover and reload unavailable. |
| AC-3 | Parts mode selects visible component, door, accessory, or optional section panel; Delete removes selected editable item with Undo; ordinary front interaction remains when Parts mode is off. | Browser interaction and model fixture | NOT TESTED: depth-hit fixture passes Parts mode selection; live click, deletion, Undo, and reload unavailable. |
| AC-4 | Mirrored 12/16/24-inch corner cases generate exactly KT, KB, toe kick; no full-height filler face in 3D or elevation; volumes do not overlap. | Three generator fixtures, rendered view inspection | NOT TESTED: all three generator fixtures pass and elevation source has three short pieces; live two-view visual inspection unavailable. |
| AC-5 | Existing geometry, POV depth/picking, and room handoff tests pass. | `npm test` | PASS: 26/26. `node --check` and `git diff --check` pass. |

## Local multi-feature Closet Builder candidate (2026-09-24 Chicago)

- Request: saved version tracker; farther POV zoom; one-second front animation; separate wall/floor material window and roulette; mood presets; removable styling items; three non-destructive layout previews; optional autonomous Murphy/Sunny; non-destructive build reveal.
- Baseline: `main` at `fe2c09d206be575f22093f2493de493c84036e6f`; active source is embedded `CLOSET_B64` in `index.html`. Preserve `ROOM_B64`, standalone historical files, saved customer projects, restored Ideal lighting, and filler KT/KB/toe geometry.
- User expressly prohibits publish/deploy. Work is a local candidate only. Existing revisions are project records; review must preserve a working draft. Surface materials and styling are Closet Builder visual metadata, independent of Room Layout structure and closet construction. Previews and animations must leave measured geometry unchanged until an explicit apply action.
- Acceptance: the ten numbered checks in the user prompt. Record actual PASS/FAIL/NOT TESTED separately; 3D/POV visual checks are not inferred from source or geometry tests. Test a centered and an off-origin room because the prior cloud-browser two-run fixture was blank in 3D/POV.

## Toe kick, shoe shelf, end panel, toolbar, Properties, and reveal — local candidate (2026-09-24 Chicago)

- Starting source: `main` `3d929fcd1d864494ebfc36500c1d3988e25266a6`; active entry `index.html` embeds `CLOSET_B64`. Work branch: `work/toe-shoe-endpanel-properties`. The embedded Room Layout and standalone historical modules remain unchanged. No publication or deployment is authorized.
- Scope: exact KB/toe contact, shoe-board rise/lip, separate end-panel object and width restoration, Front View text, tool label preferences, Properties card order preferences, complete piece-by-piece replay. Preserve room shell, project data, legacy section parts, shared partitions, camera and front-opening behavior.
- Governing rules: G-01–G-05, C-05/C-06/C-07/C-14, P-02/P-03, and new C-15/C-16/V-05/V-06. The panel is outside the existing end partition, with its back at the section back and front 1 in beyond the partition front. Panel thickness comes from the run; finish comes from the adjacent section. The run's outside span stays fixed by adjusting unlocked section widths. Preferred widths are selected first; an unlocked shelf section absorbs the remainder. If there is no valid fit, the action is rejected. Removing the last panel restores the saved pre-panel widths.
- An end with a filler, connected perpendicular run, same-wall neighboring run, or legacy finished-end part is ineligible. While a separate panel exists, section count changes are rejected so the restoration snapshot cannot silently detach from section identities. Existing section editing retains its run outside span.
- Browser data: no customer project edited. Tool names and card order use device-local keys; they do not change the saved closet model. Replay renders each measured construction primitive at 350 ms intervals and recomputes its full manifest before restart.

| Acceptance criterion | Automated evidence | Browser observation |
| --- | --- | --- |
| KB bottom at 64 mm and toe top at 64 mm | PASS: new KB normalization and boundary fixture; filler fixture | NOT TESTED: front/3D visual seam |
| Shoe shelf rear 64 mm above front; front lip | PASS: actual wedge vertices and front lip render-path fixture | NOT TESTED: POV/3D visual and clearance |
| Separate end panel on eligible ends, shared partitions intact, width restored | PASS: add both ends, reverse removal, end eligibility and 3D geometry fixture | NOT TESTED: pointer snap, selection, delete, undo, reload, finish appearance |
| Front View wording | PASS: active payload text assertion | NOT TESTED: interface view switch |
| Rename toolbar label, preserve icon/action | PASS: label function harness | NOT TESTED: live rename and persistence |
| Drag Properties cards | PASS: pointer-order function harness | NOT TESTED: live mouse/touch drag and reload |
| Replay every part | PASS: 20-shelf sequence fixture with no index cap and unchanged model | NOT TESTED: live replay/pause for a full closet |

### Publication follow-up

The user subsequently authorized publication unless a critical error was found. Live verification found two issues: the owning side of a perpendicular filler was offered as an End Panel target, and a Properties card drag left the card highlighted without changing order. The first was corrected and checked on Pages at `e7356902142332f86e6eead6922757c6b0f31914`: only the two open ends remain. The second correction moves pointer tracking and release handling to the document so the drag can finish even after the pointer leaves its starting heading. Preserve the existing card order key and all property editors; verify the final drag on Pages before reporting PASS.
