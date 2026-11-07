# Life in the UK Practice

A mobile-friendly independent study tool built from supplied Life in the UK lesson notes. It is **not affiliated with the UK government** and is not an official test simulator. Each extended practice session has 50 questions; the official test uses a different format.

## Use the practice site

Open the published link in a modern browser. English questions have a Roman Urdu translation directly beneath the question; answer choices remain in English. Each test shows the score, correct answers, and available explanations when submitted.

### Progress and privacy

Unfinished tests and revision history are stored in browser local storage on the learner’s device. No account is required and the app does not send practice answers or progress to a server. Progress is not shared between browsers or devices and may be lost if site data is cleared or private browsing is used.

The published files contain the static app and public question bank only. They do not contain learner progress. The site is an independent practice aid and cannot guarantee that its questions will appear in the official test.

## Local preview

Use Node.js 20 or newer, then run:

```sh
npm ci
npm test
npm run check:bank
python3 -m http.server 4173
```

Open `http://localhost:4173/` in a browser. The server is needed because the app loads its question bank as a JSON module request.

## GitHub Pages deployment

The workflow at `.github/workflows/pages.yml` builds a small static artifact containing only `index.html`, `src/`, and `data/questions.json`, then deploys it with the official GitHub Pages Actions. It runs when code is pushed to the repository’s default branch (`main`) or started manually with **Actions → Deploy Life in the UK Practice → Run workflow**.

For a new repository, choose **Settings → Pages → Build and deployment → Source: GitHub Actions**. After the first successful workflow run, the public site is available at:

`https://thisisirfansbackup-cyber.github.io/life-in-uk-practice/`

Question sourcing and material limitations are documented in `data/content-audit.md` and `data/audits/`; these internal review files are not included in the Pages artifact.
