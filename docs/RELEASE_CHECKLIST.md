# Ten-gate release verification report

Copy this template for each proposed app release. Record PASS, FAIL, or NOT TESTED separately for every gate; do not infer a visual PASS from a model test. For a rules-only change, record app behavior gates as NOT TESTED and do not claim a behavior release.

- Request, approved scope, change contract, and governing rule IDs:
- Source branch and exact commit; starting commit and app-file SHA-256 values:
- Active build entry/blob SHA; deployment target and deployed commit if applicable:
- Browser/version, OS, desktop viewport, mobile viewport:
- `npm test` command, result, and CI run if available:
- Fixture/project data isolation and visual evidence links (plan, elevation, both 3D sides):
- Persistence: saved state readback, reload, reopen, and module switch:
- Known limitations, unresolved decisions, and release decision:

| # | Gate and rule IDs | PASS / FAIL / NOT TESTED | Evidence and observed result |
| --- | --- | --- | --- |
| 1 | **App preservation** (G-01, G-02): compare starting and ending app bytes and UI; no change outside approved scope. |  |  |
| 2 | **Geometry invariants** (C-05): model dimensions, thicknesses, clearances, and physical bounds; no component or run intersects a partition or extends beyond its section. |  |  |
| 3 | **Section dimensions** (C-05, C-07): displayed width/depth equals saved geometry in plan, elevation, and 3D. |  |  |
| 4 | **Shared partitions** (C-06): N contiguous sections have N+1 partitions, without doubles or gaps; cabinets keep separate sides. |  |  |
| 5 | **Clearances** (C-05, D-03, R-01): wall allowances, fillers, doors, utilities, and accessories retain required space. |  |  |
| 6 | **Corner ownership** (C-01, C-02): test both directions; owner reaches back corner and terminating run ends at actual owner front face. |  |  |
| 7 | **Filler placement** (C-03, U-01): correct corner end and room-facing side; no shelf, drawer, or adjacent-run overlap. Record unresolved attachment seam separately. |  |  |
| 8 | **3D boundaries and visibility** (C-13): both viewing directions show no geometry through partitions; opaque panels hide objects behind them. |  |  |
| 9 | **Drawer bank behavior** (C-12): add/resize drawers on 32 mm spacing; no shelves inside or below bank; shelf zone above is usable. |  |  |
| 10 | **Save and sync** (P-01, P-02, P-03): save/reopen Client → Project → Closet → Revision; room edits appear in Closet Builder after switching views. |  |  |

Required gates: `npm test` passes; every affected criterion has an observed result; relevant `SMOKE_TEST.md` interactions pass, including desktop/mobile when affected. A relevant FAIL or NOT TESTED blocks a claim that behavior was fixed or released. A rules-only commit may be reported as such without passing unexercised app behavior gates. Record the deployment commit and open the deployed URL before saying “deployed.”

## POV lighting and drawer regression — local candidate 2026-09-25

- Scope/rules: `docs/CHANGE_CONTRACT.md` POV lighting and drawer regression; V-01–V-03, G-01–G-05, C-04/C-05/C-13.
- Source: `main` started at `83ea52c5926de3494f8335112a70cc73cc8d002a`; local candidate `7b35a36` with Pages entry `index.html` SHA-256 `9e8a3cea9085f6589bd7733e6624e067f88788386e4e2c57c8c3466c5a1ec8e2`. GitHub Pages has **not** been updated to this candidate.
- Verification: `npm test` 37/37 PASS; embedded script parses; `git diff --check` PASS. Browser/OS/viewport: NOT TESTED because the candidate is not published and no local browser runtime is available here. No customer project was changed.
- Release decision: BLOCKED. Automatic approval review rejected pushing the public repository's `main` branch. A separate publication approval is required. Do not describe this build as deployed or visually certified.

| # | Gate | Result | Evidence and limit |
| --- | --- | --- | --- |
| 1 | App preservation | PASS | Only embedded Closet Builder, targeted test, rulebook, and change contract changed; room payload, standalone app files, and project data untouched. |
| 2 | Geometry invariants | NOT TESTED | Existing model fixtures pass; full visual intersection check not run. |
| 3 | Section dimensions | NOT TESTED | No dimensional model change; plan/elevation/POV comparison not run. |
| 4 | Shared partitions | PASS | Existing three-section shared partition fixture passes. |
| 5 | Clearances | NOT TESTED | No clearance edit; door/utility visual workflow not run. |
| 6 | Corner ownership | NOT TESTED | Mirrored model fixtures pass; live flip workflow not run. |
| 7 | Filler placement | NOT TESTED | Existing filler model fixture passes; visual seam not inspected. |
| 8 | 3D boundaries and visibility | NOT TESTED | Depth/picking fixture proves front face wins; live two-direction and shader image review not run. |
| 9 | Drawer bank behavior | NOT TESTED | Four-bank and drawer presentation fixtures pass; live POV click and 32 mm workflow not run. |
| 10 | Save and sync | NOT TESTED | Existing data fixtures pass; browser save/reopen/module switch not run. |

Focused criteria: default no-fixture fallback luminance PASS in test; GPU shader uniform wiring PASS by source assertions, live visual NOT TESTED. Direct visible drawer click opens and closes through the active embedded handler PASS in an integration harness, live pointer interaction NOT TESTED. Occluded hit suppression PASS in a depth fixture. POV Properties controls and reset are present in the active payload; live interaction, preference reload, and GPU appearance NOT TESTED.

## Ideal POV preset follow-up candidate — 2026-09-25

- Starting published commit: `b26145dff6a55bc508bcae1736897825e0d1d808`; Pages and Rules checks succeeded. Browser: cloud Chrome at 1363 × 937, existing `Walkthrough Client / POV Walkthrough Job / POV Test Closet` fixture. No project data saved during visual review.
- Initial browser result: POV controls present and responsive; initial Bright studio image visually washed out on white surfaces. This prompted the Ideal default refinement.
- Local candidate verification: `npm test` 38/38 PASS, embedded script parses, diff check PASS. Live Ideal visual, preference reload, and drawer click remain to be checked after publication.

| # | Gate | Result | Evidence and limit |
| --- | --- | --- | --- |
| 1 | App preservation | PASS | Only active embedded Closet POV image UI/settings and targeted tests/docs changed. |
| 2 | Geometry invariants | NOT TESTED | No geometry change; existing model fixtures pass. |
| 3 | Section dimensions | NOT TESTED | No section edit. |
| 4 | Shared partitions | PASS | Existing partition fixture passes. |
| 5 | Clearances | NOT TESTED | No clearance edit. |
| 6 | Corner ownership | NOT TESTED | Existing model fixtures pass; live ownership flip not run. |
| 7 | Filler placement | NOT TESTED | Existing filler fixture passes; visual seam not checked. |
| 8 | 3D boundaries and visibility | NOT TESTED | Depth fixture passes; live two-direction Ideal image review pending. |
| 9 | Drawer bank behavior | NOT TESTED | Existing drawer model/click fixtures pass; live drawer interaction pending. |
| 10 | Save and sync | NOT TESTED | Existing fixtures pass; project save/reopen not run. POV preference uses a separate local key. |

## Exact source rollback to 6:42 PM release — 2026-09-24 Chicago

- Scope: restore the active Pages app entry and baseline tests from `b2dfd9d`; starting `main` was `712bf74`. The entry blob comparison is exact; `npm test` passes 24/24. No new behavior fix is claimed.
- Browser and viewport: NOT TESTED locally. Customer projects were not opened or modified. Deployment commit/status: see final report after publish.

| # | Gate | Result | Evidence and limit |
| --- | --- | --- | --- |
| 1 | App preservation | PASS | Active `index.html` blob exactly equals the 6:42 PM published source; later history is recoverable. |
| 2 | Geometry invariants | NOT TESTED | Baseline automated geometry checks pass; live rendered bounds not inspected. |
| 3 | Section dimensions | NOT TESTED | Baseline source restored; no cross-view browser measurement. |
| 4 | Shared partitions | NOT TESTED | Baseline automated fixtures pass; no rendered count inspection. |
| 5 | Clearances | NOT TESTED | No live clearance inspection. |
| 6 | Corner ownership | NOT TESTED | Baseline numeric fixtures pass; live ownership flip not performed. |
| 7 | Filler placement | NOT TESTED | Baseline fixtures pass; no visual seam inspection. |
| 8 | 3D boundaries and visibility | NOT TESTED | Baseline depth fixture passes; two-direction visual inspection not performed. |
| 9 | Drawer bank | NOT TESTED | Baseline bank fixtures pass; no live mini-drawer workflow. |
| 10 | Save and sync | NOT TESTED | Baseline persistence fixtures pass; no customer or disposable project reload. |

## Toolbar and filler local candidate — 2026-09-24 Chicago

- Baseline: `main` `45c456827c1a1ccc78a581aed2ab16d94945a993`, restored 6:42 PM entry. `index.html` is the active embedded entry. The user subsequently authorized pushing this candidate; record the resulting commit and Pages status separately.
- `npm test`: 26/26 PASS. Embedded Closet Builder script syntax and `git diff --check`: PASS. The embedded Room Layout payload is byte identical to baseline. Ideal POV sampled face color remains `[174,155,130]`, identical to the restored renderer.
- Browser/viewport and project reload: NOT TESTED. A local Playwright browser was unavailable; the attempted browser install failed. No customer project was edited. The 12/16/24-inch corner generator fixtures each produce exactly KB, KT, and toe kick without an 84-inch face box. This does not substitute for a visual inspection.
- Verification decision: automated checks PASS; affected browser visual and interactive checks remain NOT TESTED. A push is authorized, but do not claim a visually verified release.

| # | Gate | Result | Evidence and limit |
| --- | --- | --- | --- |
| 1 | App preservation | PASS | Room payload unchanged; active Closet payload, targeted tests, and docs changed locally. No saved project changed. |
| 2 | Geometry invariants | NOT TESTED | Three filler bounds fixtures pass; full 3D intersection survey not run. |
| 3 | Section dimensions | NOT TESTED | Existing numeric tests pass; cross-view dimension comparison unavailable. |
| 4 | Shared partitions | PASS | Existing 1/2/3 section fixture passes. |
| 5 | Clearances | NOT TESTED | Existing fixtures pass; full wall/door/utility clearance inspection unavailable. |
| 6 | Corner ownership | NOT TESTED | Mirrored numeric tests pass; live ownership flip unavailable. |
| 7 | Filler placement | NOT TESTED | 12/16/24 generator produces only three short parts; visual seam and both view directions unavailable. |
| 8 | 3D boundaries and visibility | NOT TESTED | POV depth/picking fixture passes; browser image inspection unavailable. |
| 9 | Drawer bank | NOT TESTED | Existing 32 mm fixtures pass; live interaction unavailable. |
| 10 | Save and sync | NOT TESTED | Existing data fixture passes; reload and module switch unavailable. |

## Local Closet Builder feature candidate — 2026-09-25

- Scope: user REWR ten-feature request and the already authorized toolbar/part-selection context. `docs/CHANGE_CONTRACT.md` records the contract. No publication or deployment was requested or performed.
- Recoverable baseline: `main` at `fe2c09d206be575f22093f2493de493c84036e6f`; baseline `index.html` SHA-256 `0067f3e645777a986fed5c99e228bbdaed4de68c4193a75e794bcb088b11f4c4`. Candidate is uncommitted; active `index.html` SHA-256 `9add77c69a14bc90bc4c045e5453a76cfc376b779a2e4e00ac61ccdd73da53`. Embedded `ROOM_B64` is byte-identical to baseline.
- Verification: `node --check` on the decoded active Closet Builder script PASS; `npm test` 34/34 PASS; `git diff --check` PASS. Eight focused model tests exercise revisions, front timing/clearance, material preview, layout candidates, visual prop collision, reveal stage order, mood color, and independent dog motion. These tests do not establish rendered appearance or a full interaction path.
- Browser/OS/viewport: NOT TESTED. Cloud Chrome refused the unpublished local `file:` preview under its URL policy. No alternate browser route was attempted. No project data was changed in a browser. Persistence after reload, responsive windows, visual material quality, dog paths, and 3D geometry still require a local desktop/mobile run.
- Release decision: BLOCKED for verification. The user expressly said not to publish or deploy.

| # | Gate | Result | Evidence and limit |
| --- | --- | --- | --- |
| 1 | App preservation | PASS | `ROOM_B64` unchanged; active Closet Builder is the sole app payload edited. Git baseline is recoverable. UI comparison remains untested. |
| 2 | Geometry invariants | NOT TESTED | Model tests pass; no complete rendered collision survey. |
| 3 | Section dimensions | NOT TESTED | No cross-view visual comparison. |
| 4 | Shared partitions | PASS | Existing geometry fixture verifies N+1 shared partitions. |
| 5 | Clearances | NOT TESTED | Focused ray clearance test passes; live door/drawer sweep and utilities not inspected. |
| 6 | Corner ownership | NOT TESTED | Mirrored numeric fixtures pass; live ownership flip not performed. |
| 7 | Filler placement | NOT TESTED | Existing 12/16/24-inch fixtures pass; 3D/front visual seam not inspected. |
| 8 | 3D boundaries and visibility | NOT TESTED | POV depth fixture passes; no browser image or two-sided visual. |
| 9 | Drawer bank behavior | NOT TESTED | System 32 fixtures pass; live opening/closing and bank edit not exercised. |
| 10 | Save and sync | NOT TESTED | Revision snapshot and model save fixtures pass; browser reload/reopen/module switch not exercised. |

| Acceptance check | Result | Evidence / next reproduction |
| --- | --- | --- |
| 1. Versions | NOT TESTED | VM saves two distinct IDs and snapshots, reviews/restores. In UI create two revisions, reload, review each, and confirm timestamps/active badge. |
| 2. POV zoom | NOT TESTED | Clamp fixture reaches `.32`; in POV zoom to minimum in a closed room, rotate and walk at boundaries. |
| 3. Front animation | NOT TESTED | VM confirms easing at 0/500/1000 ms and clearance cap. Click drawer/door twice in 3D and POV; time and inspect sweep near obstacles. |
| 4. Materials window and realism | NOT TESTED | IDs and material code checked; open/resize/close/reopen window, apply separate wall/floor finishes, inspect POV texture and scale under lighting. |
| 5. Roulette | NOT TESTED | VM confirms preview leaves design and saved materials unchanged. Shuffle twice in UI, cancel and keep, then reload. |
| 6. Mood | NOT TESTED | Code separates viewer mood from doc. Switch each preset in POV and compare geometry/materials before and after. |
| 7. Dress-Up | NOT TESTED | VM verifies placement avoids runs/walls/props. Add, move, remove, clear each prop in UI; compare measured design. |
| 8. Layout Shuffle | NOT TESTED | VM generates three distinct valid variants and restores draft. Preview all three in rectangular and irregular rooms with different runs, then apply one. |
| 9. Murphy & Sunny | NOT TESTED | Placement bounds fixture passes; run both dogs for several minutes around an obstacle/prop, inspect independent paths, pauses and removal. |
| 10. Build Reveal | NOT TESTED | VM checks stage filtering leaves doc intact. Play, pause, replay in 3D; compare saved design before/after. |

## Deployment follow-up — 2026-09-24 Chicago evening

- The user subsequently authorized deployment. `main` was fast-forwarded to `495dc8c7404b0d0ba44c31510d512e3d40ee3d21` and the Pages URL showed the new toolbar and Materials window in cloud Chrome at 1363 × 937.
- Live smoke: Materials window opened; Roulette displayed a preview without a save; Cancel was used. The centered `POV Test Closet` rendered room walls and closet faces. No customer design was saved during the smoke check.
- Observed failures/limits: the expanded toolbar labels overlapped at 1363 px; a small CSS follow-up arranges groups in a single scrollable flow. The off-origin `QA Fixture / Filler Visual Check / Two Wall Test` showed a blank POV, a known existing fixture issue; reproduction: open that closet and select POV. This is a FAIL for complete off-origin POV visual acceptance, not a verified material or dog-path pass. Material finish realism and most ten-feature interactions remain NOT TESTED.
- Follow-up verification: `npm test` 34/34 PASS, embedded script syntax PASS, `git diff --check` PASS before the toolbar correction. Record the correction commit and live viewport result separately after publication.

### Mixed wall-normal POV camera correction

- In the deployed two-wall QA fixture, Plan omitted the camera marker and POV displayed only the background. The camera boundary predicate was signed (`side < radius`), which rejects every interior point when a wall's local normal points outward. The boundary test now uses perpendicular distance to the wall in camera, styling, and front-clearance placement; run footprint tests retain their own oriented normals.
- A reversed-normal camera fixture passes, along with the full 35/35 test suite, embedded syntax check, and diff check. The deployed two-wall camera/POV must be visually rechecked before this failure can be marked resolved.

### Camera recovery follow-up

- The reversed-normal correction reached Pages but the two-wall fixture still had no Plan camera marker. DOM geometry showed a valid 77 × 62 in closed rectangle and clear central floor. The recovery algorithm reused an invalid saved camera as the search origin even when it was far outside the room, while the search radius was bounded by the room span.
- Invalid cameras outside the room now begin recovery from its center; valid cameras and colliding cameras already inside retain their position/search behavior. A 1000,1000 stale-camera fixture recovers into a 100 × 80 room with its zoom preserved. `npm test` 36/36 PASS; live two-wall POV requires a new deployed check.

## Toe/shoe/end-panel/toolbar/Properties/reveal local candidate — 2026-09-24 Chicago

- Baseline: `main` `3d929fcd1d864494ebfc36500c1d3988e25266a6`; work branch `work/toe-shoe-endpanel-properties`; active owner `index.html` embedded Closet Builder. No deployment or publication. Exact candidate commit/hash recorded when committed.
- Automated verification: `npm test` 43/43 PASS, embedded script syntax PASS. Browser/viewport: NOT TESTED; this unpublished local candidate was not opened in a browser. No project data changed. The automated tests establish geometric coordinates and UI-handler logic, not physical appearance or full pointer interaction.
- Release decision: NOT RELEASED by user instruction. Browser criteria below remain unverified.

| # | Gate | Result | Evidence and limit |
| --- | --- | --- | --- |
| 1 | App preservation | PASS | Room payload and standalone modules unchanged; only embedded Closet Builder, focused tests, and docs edited. Browser UI comparison not run. |
| 2 | Geometry invariants | NOT TESTED | KB, shoe wedge and end-panel coordinates pass focused fixtures; full 3D intersection survey not run. |
| 3 | Section dimensions | NOT TESTED | End-panel outside span and section widths pass fixture; cross-view visual readback not run. |
| 4 | Shared partitions | PASS | Same partition IDs before/after adding/removing both panels; existing N+1 fixture passes. |
| 5 | Clearances | NOT TESTED | Ineligible filler and neighboring ends rejected in fixture; visual fit against all room conditions not run. |
| 6 | Corner ownership | NOT TESTED | Existing mirrored fixtures pass; no new live ownership workflow. |
| 7 | Filler placement | NOT TESTED | Existing three-filler source fixtures pass and end-panel corner rejection tested; rendered seam not inspected. |
| 8 | 3D boundaries and visibility | NOT TESTED | Wedge and panel vertices pass unit fixtures; two-side occlusion/browser inspection absent. |
| 9 | Drawer bank behavior | NOT TESTED | Existing 32 mm bank fixtures pass; live drawer workflow not run. |
| 10 | Save and sync | NOT TESTED | Model snapshot and device-local preferences implemented; browser save/reload/reopen/module switch not run. |

### Live publication follow-up — 2026-09-24 Chicago

- Initial main publication `d372d21d843fd596f1d7e42160594aa685beee97` passed the 43 automated tests and served the new toolbar, but live Plan revealed an invalid End Panel marker on the owning side of a perpendicular filler. Its terminating run stops at the owner front and therefore is not found by the shared-wall-corner search. This is a **FAIL** for end-panel eligibility in the initial publication.
- Corrective candidate excludes owner ends referenced by another run's corner connection and flags any already-present panel at that junction as invalid. Added a regression fixture. Publish the corrective commit and verify the marker disappears before closing the check.

### Live follow-up — 2026-09-25 UTC

- `main` `e7356902142332f86e6eead6922757c6b0f31914` served the corrected active payload in cloud Chrome at 1363 × 937. The two-wall filler fixture now exposed exactly two open-end markers; the owner start at the connected filler was absent. An end panel added to the owner end as its own tree item, and deletion restored both original section widths (29 3/4 in). No closet revision was saved.
- Tools accepted a typed `New Run` label while retaining the Add Run SVG and click action; Reset labels restored `Add Run`. Build Reveal displayed 37 pieces over 13 seconds, advanced through partitions and shelves, paused, and replay reset to partition step zero. Full completion and every visual part were not watched through to the end.
- **FAIL:** dragging the Properties `Closet Run` heading toward `Tafisa Finish` left the source card highlighted and did not reorder the DOM. The pointer handler was revised to track movement and release at the document level. The revised build requires a new Pages drag check before that criterion can be marked PASS.
- Remaining geometry image checks for KB/toe and shoe shelf, cross-view dimensions, 3D collision survey, and save/reload are NOT TESTED in this live follow-up. The automated suite passes 43/43 after the pointer fix; it does not establish those visual gates.
