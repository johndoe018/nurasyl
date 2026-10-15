# Submission checklist — Nurasyl Nurbay

| Requirement | Deliverable / status |
| --- | --- |
| Geometry topic | Pythagorean theorem: triangle, ladder, shortest box-surface path |
| Responsive interactive page | Implemented; desktop and 390 px mobile tested |
| Three differentiated levels | Foundation, Standard, Advanced; 20 numerical variants in total |
| Adapted hints and solutions | Three progressive hints and a worked solution for every task |
| Instant answer feedback | Independent numeric checker, comma-decimal support, explicit rounding |
| AI integration | Real SmolLM2 model integration in a browser worker; successful inference needs Hugging Face access and remains unverified here |
| System prompts | `src/prompts.js`; level-specific scaffolding and verified context |
| Source code and README | Complete locally; remote publication status documented below |
| One-page report | `public/report.pdf`; editable source in `public/report.md` |
| Deployment | GitHub Actions workflow included; no verified live URL yet |

## Validation evidence

- `npm test`: **5 passed, 0 failed**, including 126 generated-problem cases.
- `npm run build`: **passed**, static production assets generated.
- `python3 tests/browser_smoke.py`: verifies grading, three levels, hints, solutions, the completion policy, new variations, saved progress/bookmarks, model-error handling, search, theme, keyboard dismissal, and mobile navigation.
- Current-instance AI/download restriction: HTTPS CONNECT to Hugging Face returned **403 Forbidden**. The browser suite simulates that failure explicitly; it is not a successful inference test.
- Current-instance GitHub API restriction: API requests returned **Forbidden**. Git repository reads work through the platform Git proxy; that does not prove API or deployment access.

## Finish publication

Review the saved environment network additions and apply them before rerunning the model and API checks. Push the local source to `main` using an authorized Git session, enable GitHub Actions under repository Pages settings, and run the included deployment workflow. Record the actual URL from a successful deployment and verify a real AI response there. Enter that URL and the populated public source-repository link in the assignment submission.

**Live website:** not yet published/verified.  
**Intended source repository:** https://github.com/johndoe018/nurasyl (verify the source is pushed and public before submitting).
