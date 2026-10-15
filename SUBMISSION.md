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
| Deployment                  | GitHub Actions workflow included; no verified live URL yet                                                                     |

## Validation evidence

- `npm test`: **5 passed, 0 failed**, including 126 generated-problem cases.
- `npm run build`: **passed**, static production assets generated. Frozen-lockfile reinstall and both development/production startup were also exercised.
- Static hosting under `/nurasyl/`: **passed**, including scripts, styles, the PDF report, and the local ONNX runtime.
- GitHub Actions build job: **passed** (24 seconds in the first run). Deployment failed with **404: Ensure GitHub Pages has been enabled**. [Workflow evidence](https://github.com/johndoe018/nurasyl/actions/runs/38810055393).
- `python3 tests/browser_smoke.py`: verifies grading, three levels, hints, solutions, the completion policy, new variations, saved progress/bookmarks, model-error handling, search, theme, keyboard dismissal, and mobile navigation.
- Current-instance AI/download restriction: HTTPS CONNECT to Hugging Face returned **403 Forbidden**. The browser suite simulates that failure explicitly; it is not a successful inference test.
- Current-instance GitHub API restriction: API requests returned **Forbidden**. Git repository reads work through the platform Git proxy; that does not prove API or deployment access.

## Finish publication

Review the saved environment network additions and apply them before rerunning the model and API checks. The source is already pushed to `main`. Open [Settings → Pages](https://github.com/johndoe018/nurasyl/settings/pages), select **GitHub Actions** as the source, and rerun the included deployment workflow. The first deployment confirmed that Pages is currently disabled; the workflow token cannot enable it. Record the actual URL from a successful deployment and verify a real AI response there. Enter that URL and the populated public source-repository link in the assignment submission.

**Live website:** not yet published/verified.

**Public source repository:** https://github.com/johndoe018/nurasyl — source pushed successfully to `main`; public GitHub page returned HTTP 200.
