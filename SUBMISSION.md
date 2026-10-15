# Submission checklist — Nurasyl Nurbay

| Requirement                 | Deliverable / status                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Geometry topic              | Pythagorean theorem: triangle, ladder, shortest box-surface path                                                               |
| Responsive interactive page | Implemented; desktop and 390 px mobile tested                                                                                  |
| Three differentiated levels | Foundation, Standard, Advanced; 20 numerical variants in total                                                                 |
| Adapted hints and solutions | Three progressive hints and a worked solution for every task                                                                   |
| Instant answer feedback     | Independent numeric checker, comma-decimal support, explicit rounding                                                          |
| AI integration              | Real SmolLM2 model integration in a browser worker; successful inference needs Hugging Face access and remains unverified here |
| System prompts              | `src/prompts.js`; level-specific scaffolding and verified context                                                              |
| Source code and README      | Pushed to the public `johndoe018/nurasyl` repository on `main`                                                                 |
| One-page report             | `public/report.pdf`; editable source in `public/report.md`                                                                     |
| Deployment                  | Published and browser-checked; source-branch and workflow deployment supported                                                                     |

## Validation evidence

- `npm test`: **5 passed, 0 failed**, including 126 generated-problem cases.
- `npm run build`: **passed**, static production assets generated. Frozen-lockfile reinstall and both development/production startup were also exercised.
- Static hosting under `/nurasyl/`: **passed**, including scripts, styles, the PDF report, and the local ONNX runtime.
- GitHub Actions build job: **passed** (24 seconds in the first run). Deployment failed with **404: Ensure GitHub Pages has been enabled**. [Workflow evidence](https://github.com/johndoe018/nurasyl/actions/runs/38810055393).
- `python3 tests/browser_smoke.py`: verifies grading, three levels, hints, solutions, the completion policy, new variations, saved progress/bookmarks, model-error handling, search, theme, keyboard dismissal, and mobile navigation.
- Current-instance AI/download restriction: HTTPS CONNECT to Hugging Face returned **403 Forbidden**. The browser suite simulates that failure explicitly; it is not a successful inference test.
- Current-instance GitHub API restriction: API requests returned **Forbidden**. Git repository reads work through the platform Git proxy; that does not prove API or deployment access.

## Publication correction

The blank page was caused by Pages publishing raw source from `main:/`, including an uncompiled `/src/main.jsx` script. The application now keeps its editable HTML in `app/index.html` and commits a complete compiled static site at the repository root. `npm run build` refreshes both `dist/` and those branch-publication files. Both Pages publication modes therefore serve a compiled application.

A production artifact deployment succeeded in [run 38811431510](https://github.com/johndoe018/nurasyl/actions/runs/38811431510), and the live interface was exercised over TLS-verified HTTPS. The branch-published root was separately tested with the complete browser suite. Pages mode changes were denied to the integration (403); the source layout fix removes that requirement.

**Live website:** https://johndoe018.github.io/nurasyl/ — compiled application verified in the browser.

**Public source repository:** https://github.com/johndoe018/nurasyl — source pushed successfully to `main`; public GitHub page returned HTTP 200.
