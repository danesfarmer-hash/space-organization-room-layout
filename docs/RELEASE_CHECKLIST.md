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
