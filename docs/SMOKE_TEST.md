# Human workflow smoke test

Use a disposable browser profile or record fixture; do not overwrite a customer's project. Record browser/version, viewport, commit, screenshots, and PASS/FAIL/NOT TESTED for each line. Automated geometry tests do not substitute for these interactions.

## Two-wall corner (desktop, then affected mobile viewport)

1. Create Client `Fixture Client` → Job `Corner A` → Closet `Two Wall`; enter Room Layout. Draw a closed 120 × 96 in rectangular room and identify the bottom and left adjoining walls and room interior. Save or switch to Closet Builder; verify both walls and exact dimensions arrived.
2. Build both runs. Select bottom wall as owner and left as terminating run; compare plan to rulebook fixture A. Inspect filler strip and owner section at the back corner, then both 3D orbit sides and elevation. Capture each view. Separately record model bounds/intersections and rendered occlusion: no shelf, drawer, rod, filler, or run crosses a partition, and opaque partitions hide components behind them from both sides.
3. Flip ownership and set owner depth to 12 in. Compare to fixture B; inspect the filler on the other side. Open a door and drawer on each wall; confirm travel toward room center. If the UI cannot perform an explicit flip, mark FAIL for reversible ownership, not PASS by rebuilding a fresh example.
4. Enter a custom section width (e.g. 23 1/2 in), add then remove a section, and check shared partition count, outside width, thickness, and displayed depth in plan/elevation/3D. Add and resize a mini drawer; verify 32 mm spacing and no shelves inside or below its bank. Save, reload the page, reopen the exact closet and revision; compare dimensions, owner, filler, drawers, and fronts.
5. Click the wrong wall/item, click blank space, perform a short drag, Undo once, Redo once, then repeat selection. Verify only the intended object changes and one completed drag makes one undo step.

## Three-wall layout

1. Create another fixture closet in the same job with a closed 120 × 96 in rectangular room. Build a U-shaped system on three of its walls and assign both back-corner owners independently.
2. Check actual 12/16/24 in return depths, both terminating endpoints, both visible fillers, no overlapping shelves/partitions, and usable center clearance in plan and two 3D angles.
3. Edit one wall length and one section width. Switch Room Layout ↔ Closet Builder without a separate manual save, then save/reload/reopen. Record which values persist and which change downstream.
4. Repeat affected controls at a 390 × 844 touch-sized viewport and a 1440 × 900 desktop viewport. Verify selection, drag, zoom, menu access, and readable geometry. Record any browser automation limitation explicitly.
