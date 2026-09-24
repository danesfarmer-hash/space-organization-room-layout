# Space Organization release verification — 2026-09-24

- Scope: room/closet synchronization, wall run fitting, drawer bank, POV camera, section icons; see `CHANGE_CONTRACT.md`. The user's later “test and publish” superseded the earlier no-deploy instruction.
- Source: `danesfarmer-hash/space-organization-room-layout`, baseline `main` `b14352fdfd2cc6b0a14b7c37bf16a5f23456ab19`, baseline deployed `index.html` SHA-256 `809fe459c87da3394bf4f5c752d7c12b956c46d22bd7ae831b2c8e17eb4d20b7`.
- Final app `index.html` SHA-256 `934db817fd5eee27e3b26ed84a69c5fd9047edc99e70438d1e57f4c5359f8366`. App file commit `ed2ee0fbbcb8a0214abd19c2ad3c94fc7784eb7f`; test commit `0959e69f5c3134855321efe0c54bddb3e4c009bc` on `main` before this report.
- Local `npm test`: 17/17 PASS. GitHub Rules checks #6: PASS at `0959e69`. Pages build #53 succeeded for app-file commit; later Pages builds need verification after this report.
- Browser: signed-in cloud Chromium, Linux, 1363 × 936 desktop. Mobile viewport and touch holds NOT TESTED. Fixture was created only in this browser's local Project Library: Fixture QA → Room Sync Test → Two Wall. No customer project was edited.
- Live URL: https://danesfarmer-hash.github.io/space-organization-room-layout/

| # | Gate | Result | Observed evidence and limit |
| --- | --- | --- | --- |
| 1 | App preservation | PASS | Diff from baseline changes only `index.html`, change contract, tests, and this report; standalone app files were untouched. Source diff was checked. |
| 2 | Geometry invariants | NOT TESTED | Automated bounds fixtures pass; full visual model/3D intersection check was not completed. |
| 3 | Section dimensions | NOT TESTED | Resized wall 46→52″ and run 45¾→51¾″; two sections 24¾″ and five drawer boxes 23 11/16″ after reload. Elevation/3D dimensional agreement was not fully compared. |
| 4 | Shared partitions | PASS | Automated three-section fixture asserts four unique shared partitions; wall fit fixture retains three partitions for two sections. |
| 5 | Clearances | NOT TESTED | Impossible-fit unit fixture retains the run and reports a conflict. Door, utility, and hardware clearances were not visually checked. |
| 6 | Corner ownership | NOT TESTED | Both direction model fixtures pass. Live ownership flip and both 3D sides were not completed. |
| 7 | Filler placement | NOT TESTED | Mirrored model fixtures pass. Live filler/adjacent run seam was not inspected. |
| 8 | 3D boundaries and visibility | NOT TESTED | POV per-pixel occlusion fixture passes. Both orbit directions and opaque partition visibility were not visually certified. |
| 9 | Drawer bank | NOT TESTED | Mini drawer click yielded five drawers and one bottom boundary in the tree; mounting-row, rejection, and shelf-zone model fixtures pass. Hardware-specific fit and every affected view remain unverified. |
| 10 | Save and sync | NOT TESTED | Unsaved room switch transferred 46×37″; wall edit to 52″ automatically resized the run and retained five drawers. Reload/reopen retained room, run, drawer-box widths; Library showed two dated recovery snapshots and no named revision. Snapshot restore, named revision, repeated no-change toggle, and mobile remain untested. |

Additional requested interactions: the Properties icon set displayed Open, Shelves, Double Hang, Long Hang, Drawers, Doors, and Shoe Shelves; clicking Drawers created its build. POV arrow controls and the plan marker responded to clicks and dragging, but the small-room image showed broad flat panels, so room-facing front rendering is NOT TESTED. Browser evidence is retained with the task response. The app is published, but the incomplete geometry and mobile gates prevent a full behavior certification.

Unresolved specification: the app has generic drawer deductions but no selected hardware/front catalog. Exact hardware gap and slide clearance cannot be certified. Door hinge hand and exact swing remain unresolved.

## Room Layout axis drag and direct length release

- Scope: embedded Room Layout wall-body and dimension-label pointer behavior, plus repeatable axis tests and rule R-05. Baseline `main` `42fe5e2a95e8bd1349e5366d12462d8b59d158f3`; app file baseline SHA-256 `48d8de0ddfc4c77985ab7742e4bf74057e6de79d1cdbde04b35305d18913ad02`.
- Published app commit `7cc97c3016a3f5b6ceb26ad065edeb3b38ce809d`; final `main` test commit `4259744959f627b4af84aebf7332a64f04229eca`. Pages deployment #62 and Rules checks #14 succeeded at the latter commit. The deployed app was opened in cloud Chromium at 1363 × 936 on Linux.
- Local `npm test`: 22/22 PASS; extracted embedded Room script parsed; `git diff --check` passed. The app diff changes only the embedded Room payload in `index.html`; Closet Builder and standalone HTML files were not edited.
- Live fixture: Fixture QA → Room Sync Test → Two Wall, initially 54 × 37″. Dragging its top length label along the wall changed the room to 59 15/16 × 37″ and mirrored the opposite wall. Perpendicular label drag did not resize. Perpendicular wall-body drag left geometry unchanged; tangent drag shifted the top endpoints and showed 60″. Point 3 selected and dragged, changing connected wall dimensions. Three undos restored the 54 × 37″ rectangle. Closet Builder showed Wall 1 at 54″; reload and reopen retained the restored room. No named revision was overwritten.

| # | Gate | Result | Evidence and limit |
| --- | --- | --- | --- |
| 1 | App preservation | PASS | Only approved embedded Room interaction, R-05, contract, and focused test changed from the starting build; visible toolbar and panels remained in place. |
| 2 | Geometry invariants | NOT TESTED | Room wall endpoint and dimension behavior passed; closet component bounds and 3D intersections were outside this focused test. |
| 3 | Section dimensions | NOT TESTED | Closet sections were not changed or compared in elevation/3D. |
| 4 | Shared partitions | NOT TESTED | No closet partition edit. Existing automated fixtures passed. |
| 5 | Clearances | NOT TESTED | Doors, utilities, hardware, and allowances were not changed or visually checked. |
| 6 | Corner ownership | NOT TESTED | No corner run edit. |
| 7 | Filler placement | NOT TESTED | No filler edit. |
| 8 | 3D boundaries and visibility | NOT TESTED | No 3D view comparison in this release check. |
| 9 | Drawer bank | NOT TESTED | No drawer edit. Existing automated fixtures passed. |
| 10 | Save and sync | PASS | After undo, Closet Builder showed 54″ wall; reload/reopen retained the 54 × 37″ room. Named-revision creation was not exercised. |

Desktop axis wall, label, vertex, undo, handoff, and reload interactions passed. Double-click exact dimension editing, hosted-object hit priority, plan pan, angled-wall browser drag, and mobile touch remain NOT TESTED; numeric horizontal/angled axis fixtures passed. The deployed feature is available, with those workflow limits recorded rather than certified.
