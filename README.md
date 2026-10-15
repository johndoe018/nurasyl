# Axiom — Find your angle

A responsive geometry learning space for **Nurasyl Nurbay**, created for *AI for Differentiated Learning*. The interface takes inspiration from X: black and white surfaces, thin separators, a three-column feed, blue accents, rounded controls, and a familiar system sans-serif stack. It uses original branding and illustrations; it does not bundle X's proprietary Chirp font.

## One idea, three starting points

The single core concept is the **Pythagorean theorem**. Difficulty changes the unknown, the context, and the amount of scaffolding.

| Level | Task | First example | Guidance |
| --- | --- | --- | --- |
| Foundation | Find a right triangle's hypotenuse | Legs 6 cm and 8 cm → **10 cm** | Identify the sides, substitute, square and add |
| Standard | Model a ladder against a wall and find a leg | Ladder 13 m, base 5 m → **12 m** | Recognize the hypotenuse and rearrange the formula |
| Advanced | Find the shortest surface route between opposite corners of a box | 3 × 4 × 12 cm → **√193 ≈ 13.89 cm** | Unfold adjacent faces and compare three diagonals |

There are seven Foundation, seven Standard, and six Advanced numerical variations, cycling when requested. Problems include three progressive hints, a worked solution, immediate answer feedback, bookmarks, and a local progress history. Opening a solution prevents that attempt from counting as independent completion. A new variation lets the student try again.

## Run locally

Requires **Node 20.19+, 22.12+, or 24** and npm. No database, account, backend service, or secret is required.

```bash
cd /workspace/nurasyl
ONNXRUNTIME_NODE_INSTALL_CUDA=skip npm ci
npm run dev
```

The development server listens on port **3000**. For the tested production workflow:

```bash
npm test
npm run build
npm run preview -- --port 3000
```

`ONNXRUNTIME_NODE_INSTALL_CUDA=skip` is an ONNX-supported option. It omits unused server GPU binaries; browser WebAssembly inference and package integrity checks remain enabled. If your machine restricts the default npm cache, set `npm_config_cache=/workspace/.npm-cache` as well. The setup/start commands use the existing checkout; a separate Git worktree is unnecessary.

## Real AI, on your device

The **Ask AI tutor** dialog runs [`onnx-community/SmolLM2-135M-Instruct`](https://huggingface.co/onnx-community/SmolLM2-135M-Instruct) through Transformers.js and ONNX Runtime in a dedicated browser worker. The model uses `q4` weights and the WebAssembly CPU backend. It is loaded only after the learner chooses **Explain my next step**. The first download is roughly 100–200 MB; subsequent visits can reuse the browser cache. Model loading and CPU inference may take time on slower devices.

The model explains a *verified hint* rather than generating the answer used for grading. `src/prompts.js` contains the actual system prompts: simple, explicit steps at Foundation; contextual reasoning at Standard; unfolding and comparing routes at Advanced. The prompt includes the selected problem and current hint. Generation uses at most 100 new tokens and deterministic decoding. AI can still be inaccurate, so the verified hint and worked solution remain visible and authoritative.

**The deterministic hints are not AI outputs.** If the model download fails, the app reports that failure and offers a retry; it never substitutes a canned response and labels it AI. Mathematics practice works without the model once the app has loaded. This is not an offline-installable PWA.

No student answers, names, or progress are sent to an inference API. Hosting providers and Hugging Face receive ordinary requests for application/model files. Progress and bookmarks are stored in this browser's `localStorage`; clearing site data clears that history. No API key is embedded in the application. Using an open-source in-browser model removes the need for an API-key backend.

For network-restricted environments, permit `huggingface.co` and the model's redirected CDN destinations (for example `cas-bridge.xethub.hf.co`, `us.aws.cdn.hf.co`, or the Hugging Face LFS CDN). JavaScript and WebAssembly runtime files are served from the app itself.

## Verification

```bash
npm test
```

The five Node test groups cover 126 generated cases, independent default answers, all three surface unfoldings, numerical parsing/rounding, invalid parameters, and differentiated prompts. Browser checks exercise actual learner interactions:

```bash
# Python Playwright and Chromium are prerequisites for this optional UI suite.
python3 -m pip install playwright
CHROMIUM_PATH=/usr/bin/chromium python3 tests/browser_smoke.py
```

Start the app first. Set `AXIOM_TEST_URL` to override the default internal test address and `AXIOM_TEST_ARTIFACTS` to choose a screenshot directory. The suite uses an isolated browser context; it does not alter an existing learner's data. The unavailable-model test intentionally blocks model requests and **does not validate real inference**.

Current cloud validation: production build and math tests passed; functional browser results are recorded in `SUBMISSION.md`. Hugging Face access was denied by the cloud network proxy, so successful model loading and real generated output still need a live check with that access enabled. Do not describe inference as verified until that check passes.

## Deployment

The production output in `dist/` is a static website, including the local WebAssembly runtime. Vite uses relative asset paths so root hosting and repository subpaths both work. Deploy the **whole** directory, including `onnx/` and `assets/`.

### GitHub Pages

1. Push the source to the `main` branch of `johndoe018/nurasyl`.
2. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. Run the included **Validate and deploy Axiom** workflow (or push to `main`). It performs a frozen install, math tests, production build, and Pages deployment.
4. Take the actual live URL from the completed deployment, open it on desktop/mobile, and test a real AI response. Do not submit a presumed URL as a verified deployment.

For Netlify or Vercel, use `npm run build`, output directory `dist`, and set build environment variable `ONNXRUNTIME_NODE_INSTALL_CUDA=skip`. No serverless function is required.

## Submission materials

- [`public/report.pdf`](public/report.pdf): the one-page project report, also downloadable from the site.
- [`public/report.md`](public/report.md): editable report source.
- [`SUBMISSION.md`](SUBMISSION.md): checklist, validation evidence, and publication status.
- Source repository: <https://github.com/johndoe018/nurasyl> (local source must be pushed before this link contains the implementation).

Report authorship is attributed to Nurasyl Nurbay with AI development assistance disclosed. The learner should understand and review the implementation and prompts before submitting academic work.

## Project map

```text
src/App.jsx           Learner interface, progress, bookmarks and AI lifecycle
src/styles.css        X-inspired responsive dark/light interface
src/math.js           Independently checked tasks, solutions and answer checking
src/prompts.js        Level-specific system prompts
src/ai.worker.js      Real on-device language model inference
scripts/copy-onnx.mjs  Prepares same-origin WebAssembly files
tests/                Mathematics and browser functional checks
public/report.*       One-page assignment report
.github/workflows/    Validation and GitHub Pages deployment
```
