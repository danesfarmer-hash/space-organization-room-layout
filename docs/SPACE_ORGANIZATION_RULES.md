# Space Organization app rulebook — v1.1

**Authority and scope.** This is the version-controlled app rulebook. The user's private Global Rules Google Doc is the broader working agreement, read for this setup at its then-current revision. Its private identifier is deliberately omitted from this public repository; future chats need access supplied in that session. The latest explicit user instruction governs over an older preference. A conflict must be recorded, not silently resolved. This file does not assert that an unverified behavior currently works.

**Baseline observed 2026-09-24:** `danesfarmer-hash/space-organization-room-layout`, `main`, commit `163caeff6d1d652f67c4fb50e9c0cbe539148a69`; GitHub Pages path `https://danesfarmer-hash.github.io/space-organization-room-layout/`. `index.html` is the Pages entry and embeds `ROOM_B64` and `CLOSET_B64`. `room-layout.html` and `closet-builder.html` are separate tracked files, not the active embedded build merely because their names match. Git retains the baseline. Recheck branch and entry before every change.

**Priority:** P0 release/accuracy gate; P1 confirmed product requirement; P2 revisable default. **Status:** confirmed = explicit requirement; default = heuristic; observed = current code fact, not user approval; unresolved = do not implement a guessed choice; superseded = historical rule retained for traceability. Methods identify what must be inspected; they are not claims of passing tests.

| ID | Scope | Priority / status | Exact requirement or record | Verification |
| --- | --- | --- | --- | --- |
| G-01 | Global work | P0 confirmed | Identify active branch/commit/build before edits; keep one authoritative build owner and a recoverable commit. | Compare branch/tree and entry blob before/after. |
| G-02 | Global work | P0 confirmed | Limit edits to the change contract; preserve unrelated behavior, icons, styles, and saved projects. | Exact diff and affected workflow review. |
| G-03 | Global work | P0 confirmed | Report observed PASS/FAIL/NOT TESTED per criterion; never call an unobserved action fixed, tested, or deployed. | Release report with evidence. |
| G-04 | Global work | P0 confirmed | Ask the smallest focused question for materially missing geometry or conflicting rules; keep independent setup work moving. | Decision log and no guessed implementation. |
| R-01 | Room Layout | P1 confirmed | Room Layout owns walls, corners, doors, windows, ceiling, utilities, and the architectural shell; closet modules do not rewrite the shell. | Save a room, switch modules, compare room state. |
| R-02 | Room Layout | P1 confirmed | Valid committed Properties dimensions drive geometry and labels; invalid input leaves the last valid state and explains why. | Edit, inspect geometry/label, reload. |
| R-03 | Room Layout | P1 confirmed | An item on a wall wins hit testing over its host wall; a completed drag is one undo step, a click is not. | Desktop/touch selection, drag, undo. |
| R-04 | Room Layout | P1 confirmed | Window Height From Ceiling = ceiling height − window height − Height From Ground; no Depth field by default. | Change each input and inspect recalculation. |
| R-05 | Room Layout | P1 confirmed | A wall-body drag translates only along that wall's tangent. Its length value and vertices are selectable, draggable geometry controls. Purely perpendicular motion does not change wall length or create an undo step. | Drag horizontal, vertical, and angled walls and length labels; select and drag vertices; compare dimensions and undo/reload. |
| C-01 | Closet Builder | P1 confirmed | Either adjoining run can own an inside corner. Owner reaches the back corner; perpendicular run stops at the owner's actual inward/front face. No overlap or unused run length. | Mirrored two-wall fixtures plus plan/elevation/3D inspection. |
| C-02 | Closet Builder | P1 confirmed | Deduct actual owner return/section depth (12, 16, 24, or custom), not a fixed generic value. Recompute on ownership/depth changes. | Numeric fixtures and flip ownership. |
| C-03 | Closet Builder | P1 confirmed | A corner filler is physically visible on the terminating run and located at its corner end, facing the room. It must not cover the back shelf or appear on the opposite side. | Mirrored plan and 3D screenshots with labeled faces. |
| C-04 | Closet Builder | P1 confirmed | Doors and drawers open toward the room center. The face normal and opening motion must agree in plan, elevation, and 3D. | Open fronts from both mirrored walls and compare room-center direction. |
| C-05 | Closet Builder | P1 confirmed | The underlying model preserves section widths, material thicknesses, wall/filler/door/utility/accessory clearances, and component bounds. Shelves, drawers, rods, fillers, and runs do not physically intersect partitions or extend past their assigned section or return. Plan, elevation, and 3D derive dimensions from the same saved geometry. | Independent outside-width/partition coordinates and component-bound fixtures; compare saved dimensions across views. |
| C-06 | Closet Builder | P1 confirmed | N contiguous sections with two outside sides use N+1 shared partitions; independent cabinets have their own sides. | 1/2/3 section fixtures and rendered count. |
| C-07 | Closet Builder | P1 confirmed | Exact custom section widths remain possible; use actual thickness and filler widths in outside width and remaining-span calculations. | Enter custom widths, save/reload, measure. |
| C-08 | Closet Builder | P1 confirmed | Standard suggested widths 12/16/24 do not prevent custom widths; a run can be divided into exact sections. | Width input and redivision fixture. |
| C-09 | Closet Builder | P1 confirmed | Shelves may be above drawers; the adjacent middle shelf aligns to drawer-bank top. Drawers cannot hide behind a front filler. | Elevation and 3D side-by-side fixture. |
| C-10 | Closet Builder | P1 confirmed | Corner section behind a filler is hanging only unless the user makes an explicit design exception. | Component validation at both corner ends. |
| C-11 | Closet Builder | P1 confirmed | Partition thickness defaults to 3/4 in and remains editable. Drawer box width deducts 1-1/16 in from clear opening unless specifically overridden. | Properties and calculated dimensions. |
| C-12 | Closet Builder | P1 confirmed | Adding or resizing a drawer, including a mini drawer, recalculates the bank on the 32 mm system. Shelves use the usable zone above the bank; no shelves exist inside or below the drawer bank. | Add/resize mini drawer, inspect 32 mm spacing and shelf positions in elevation/3D, save/reload. |
| C-13 | Closet Builder | P1 confirmed | 3D rendering respects physical bounds and occlusion from both viewing directions. Nothing appears to pass through a partition; opaque panels hide shelves, drawers, rods, fillers, and other geometry behind them. A model invariant passing C-05 does not itself prove this rendered view. | Capture both 3D orbit sides for mirrored two-wall and three-wall fixtures; inspect depth order and hidden surfaces. |
| G-05 | Global work | P0 confirmed | Complete the ten distinct release gates in `docs/RELEASE_CHECKLIST.md`; mark each PASS, FAIL, or NOT TESTED with evidence. A relevant FAIL or NOT TESTED blocks a claim that the affected behavior is fixed or released. | Review all ten results, exact build, fixture, and evidence before release claim. |
| P-01 | Project Library | P1 confirmed | Client → project/job → closet → revision is the saved hierarchy; room and closet states belong to the same closet record. | Build/edit/save/reload/reopen. |
| P-02 | Project Library | P1 confirmed | Valid user-entered dimensions and saved room/closet state do not silently revert when switching modules or reopening. | Compare exact values before/after switch and reload. |
| P-03 | Project Library | P1 confirmed | A completed change that requires persistence writes the state and survives reload; report a save error instead of claiming success. | Read saved record, reload, reopen. |
| D-01 | Closet Builder | P2 default | Prefer filler width at least 10 in, usually 10–12 in, subject to physical constraints and explicit approval for exceptions. Current code clamps corner access fillers to 10–13 in; this is an observed implementation detail, not a new requirement. | Width fixture, manual constructability review. |
| D-02 | Closet Builder | P2 default | Shorter run usually owns the corner; ownership remains reversible. | AI fixture with unequal walls, then flip. |
| D-03 | Closet Builder | P2 default | Depth suggestions 12/16/24 in; wall-to-wall fitting allowance usually 1/4–1/2 in. | Properties and outside dimension. |
| O-01 | Global work | P2 observed | GitHub Pages serves `index.html` from `main`; source is one HTML file containing two base64 embedded modules. Standalone files may differ. | Inspect Git tree, hashes, and embedded payloads. |
| U-01 | Closet Builder | P0 unresolved | The latest correction says the filler is on the *other side of the shelf* in the failing project. Exact 3D attachment/seam relative to the owner shelf and partition needs a marked screenshot or a specific plan point before changing the model. Do not infer it from “left/right.” | User-marked image, then mirrored fixture. |
| U-02 | Closet Builder | P0 unresolved | The exact open-front hinge side, swing arc, and drawer travel for every wall orientation are not established by the stated “toward center” rule alone. Preserve current controls while validating direction; ask only if multiple mechanically valid arcs remain. | Mirrored open-front views and targeted user decision. |
| S-01 | Closet Builder | P2 superseded | “A fixed corner run-length deduction” is superseded by C-02's actual owner depth. | Reject a hard-coded fixed deduction. |
| S-02 | Global work | P2 superseded | Treating standalone `closet-builder.html` or `room-layout.html` as the deployed source solely by filename is superseded by G-01/O-01. | Confirm entry and embedded blob at current commit. |

## Corner coordinate contract

Plan coordinates in inches; the room interior is the positive side of each wall's **inward normal**. A run's front is its depth face toward the interior, independent of screen left/right. An owning run reaches the shared back corner. A terminating run ends at the owner's front plane; its filler occupies the corner-end strip along its own wall and presents its front face toward the room. This coordinate contract specifies placement, not an unconfirmed cabinet fastening detail (U-01).

| Mirrored fixture | Walls and inward normals | Owner / terminating run | Required stop and filler face |
| --- | --- | --- | --- |
| A: owner on bottom | Bottom wall from (0,0) to (120,0), inward (0,+1); left wall from (0,96) to (0,0), inward (+1,0). | Bottom owns (0,0), depth 16. Left terminates. | Bottom reaches x=0. Left run stops at y=16, 16 in from the back corner. Its corner-end filler front lies toward +x. No section crosses y=16 into the owner's depth. |
| B: owner on left | Same walls/normals, ownership flipped. Left owns (0,0), depth 12. Bottom terminates. | Left reaches y=0. Bottom begins at x=12, 12 in from the back corner. Its corner-start filler front lies toward +y. No section crosses x=12 into the owner's depth. |

Mirror either fixture across the room centerline and transform both wall tangent and inward normal. Expected physical relationships remain the same; “start/end” can reverse, and renderer labels must follow the transformed geometry. The filler width is independent of the depth deduction: e.g., a 13 in visible strip does not replace the 16 in owner-depth stop.

## Rule maintenance

Add a stable ID for each new durable requirement. Change status to superseded with its successor ID when displaced; never silently delete the old rule. Keep assumptions and unresolved decisions visible. A behavior change requires a change contract, independent expected fixture values, a targeted test, and a release report. Do not edit this rulebook solely to make a failing test pass without resolving the underlying conflict.

## POV image and interaction (2026-09-25)

| ID | Scope | Priority / status | Exact requirement | Verification |
| --- | --- | --- | --- | --- |
| V-01 | POV | P1 confirmed | A closet remains clearly lit and readable in POV without placed light fixtures. Fixture lights may contribute, but are not a prerequisite for usable rendering. | Empty-fixture room in POV, light and dark Tafisa, both view directions. |
| V-02 | POV Properties | P1 confirmed | POV Properties offers live brightness, ambient light, shadows, contrast, warmth, and render quality controls with a bright default and reset. These are view preferences and must not alter project geometry. | Adjust, switch view, reload, compare saved project state. |
| V-03 | POV fronts | P1 confirmed | A short click on a visible drawer front toggles the physical drawer toward the room; a hidden front cannot be clicked through opaque geometry. A drag still moves the camera; Alt-click inspects an item. | Click/drag/Alt-click in a disposable drawer fixture, then save/reload. |

**V-02 clarification (2026-09-25):** The default POV image mode and Reset action use the named Ideal preset. A manually adjusted slider becomes Custom; selecting another preset or Ideal restores its complete saved image settings. High quality supersamples at standard display density, with a bounded pixel budget. Existing user-edited image preferences stay device-local.
