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
