# Rules workflow setup verification

Source baseline: `main` at `163caeff6d1d652f67c4fb50e9c0cbe539148a69`. Active Pages entry `index.html` blob `7192a95fcb9f21e7a9b817888c9b80b1f171d165`. This setup adds repository guidance, rulebook, templates, fixture tests, and CI; it does not edit any HTML app file or customer data.

| Setup criterion | Result | Evidence / limit |
| --- | --- | --- |
| Read current Global Rules document and inspect repository | PASS | Read the native Google Doc and the three-file Git tree; inspected active embedded Closet Builder and parent persistence functions. |
| One discoverable instruction file, one app rulebook, change/release templates | PASS | `AGENTS.md`, `docs/SPACE_ORGANIZATION_RULES.md`, `docs/CHANGE_CONTRACT.md`, `docs/RELEASE_CHECKLIST.md`. |
| Mirrored corner coordinate examples and unresolved details | PASS | Rulebook fixtures A/B and U-01/U-02; no app geometry changed. |
| Automated geometry and storage checks | PASS | `npm test`: 5 passed, 0 failed against functions decoded from active `index.html`. Covers two ownership directions, return depth change, filler plan face, partition count, and saved custom width/room record. |
| CI wiring in the proposed commit | PASS | `.github/workflows/rules-check.yml` runs `npm test` on push and PR. It does not configure branch protection or block a manual Pages publish. Remote CI is NOT TESTED because the commit has not reached GitHub. |
| End-to-end human clicks, wrong clicks, 3D occlusion, door/drawer motion, save/reload, desktop/mobile | NOT TESTED | `docs/SMOKE_TEST.md` is a precise manual gate. Browser installation failed in the setup environment, so no visual or full interaction claim is made. |
| App bytes preserved | PASS | `git hash-object index.html` equals baseline blob `7192a95fcb9f21e7a9b817888c9b80b1f171d165`; neither standalone HTML file is edited. |

The geometry tests are focused model checks; a synthetic storage check is not a browser reload. The visual filler attachment seam described by the user's latest correction remains U-01 until marked evidence resolves it. No deployment of app behavior is authorized by this setup.

**Remote publication:** NOT COMPLETED. The direct Git push had no credentials, and the connected GitHub write action returned HTTP 403. This report and workflow remain local until repository write access is available. No remote build or workflow run is claimed.
