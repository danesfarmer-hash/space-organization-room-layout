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
