# Life in the UK Practice

A mobile-friendly independent study tool built from the supplied Life in the UK lesson notes. It is **not affiliated with the UK government** and is not an official test simulator.

The practice covers **all 407 supplied questions** in their original order:

- Block 1: questions 1–51
- Block 2: questions 52–102
- Block 3: questions 103–153
- Block 4: questions 154–204
- Block 5: questions 205–255
- Block 6: questions 256–306
- Block 7: questions 307–357
- Block 8: questions 358–407

Each block keeps its questions in order. Separate revision rounds bring back questions you missed, prioritising the ones you repeatedly get wrong; revision does not replace or reorder study-block questions. Completing every block means you have worked through all 407 questions, not that you have mastered them.

## Use the practice site

Open the published link in a modern browser. English questions have a Roman Urdu translation directly beneath the question; answer choices remain in English. Check each answer to see immediate feedback; a checked answer is locked for that test. After finishing a block or revision round, review your answers and explanations.

### Progress and privacy

Completed blocks, question history, and an unfinished test are stored in browser local storage on the learner’s device. No account is required and the app does not send practice answers or progress to a server. Progress is not shared between browsers or devices and may be lost if site data is cleared or private browsing is used.

If an unfinished test exists, starting a different block or revision round asks before replacing it. Completed history is kept. Unreadable saved data is never silently overwritten.

The published files contain the static app, the public question bank, and the legacy-progress mapping only. They do not contain learner progress. The site is an independent practice aid and cannot guarantee that its questions will appear in the official test.

## Local preview

Use Node.js 24, then run:

```sh
npm ci
npm test
npm run check:bank:full
python3 -m http.server 4173
```

Open `http://localhost:4173/` in a browser. The server is needed because the app loads its question bank and legacy mapping as JSON requests.

## Content preparation

Source questions are kept in `data/source-questions.json`. Verified lesson content is prepared in `data/prepared/lesson-01.json` through `lesson-17.json`, then assembled into `data/questions.json`:

```sh
npm run content:status
npm run build:bank
npm run check:bank:full
```

The full check refuses release unless all 407 source positions are present, verified or corrected, translated, and backed by a dated HTTPS source. Sourcing and corrections are documented in `data/content-audit.md` and `data/audits/`.

## GitHub Pages deployment

The workflow at `.github/workflows/pages.yml` installs dependencies, runs the tests and full content gate, then publishes only `index.html`, `src/`, `data/questions.json`, and `data/legacy-question-map.json`. It runs when code is pushed to the repository’s default branch (`main`) or started manually with **Actions → Deploy Life in the UK Practice → Run workflow**.

For a new repository, choose **Settings → Pages → Build and deployment → Source: GitHub Actions**. After the first successful workflow run, the public site is available at:

`https://thisisirfansbackup-cyber.github.io/life-in-uk-practice/`
