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
