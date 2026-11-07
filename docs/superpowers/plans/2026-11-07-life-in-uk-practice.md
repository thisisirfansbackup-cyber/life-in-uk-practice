# Life in the UK Practice App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and publish a polished mobile-first Life in the UK practice site using the supplied lessons, verified answers, Roman Urdu question translations, 50-question tests, and device-local spaced revision.

**Architecture:** A static site with no runtime dependencies serves a versioned JSON question bank and uses small JavaScript modules for test selection/scoring, browser-local progress, and the user interface. GitHub Pages hosts the site; learning progress never leaves the learner's browser. A development-only DOM test library will exercise the interface.

**Tech Stack:** HTML, CSS, modern browser JavaScript modules, JSON, Node.js built-in test runner, jsdom for development-only DOM tests, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-07-life-in-uk-practice-design.md`

## Global Constraints

- Use only questions drawn from the supplied lessons. Do not add unrelated questions.
- Verify answers against the current official Life in the UK study material and correct discrepancies; where the complete guide is not publicly accessible, use accessible official government/legal sources and record any claims those sources cannot confirm.
- Record sources and content corrections in project materials for quality control. Do not show correction warnings to the learner in the practice flow.
- Preserve questions that require two answers as select-two questions; both answers must be selected for a correct response.
- Provide four answer choices for every question.
- Show a Latin-script Roman Urdu translation of the question below its English text. Do not translate the answer choices.
- Each practice test contains exactly 50 distinct questions when the bank has at least 50 eligible questions.
- The test is exam-like: show the result and review after submission, rather than reveal correctness after every answer.
- Save progress on the learner's device/browser, with no account, server, or cross-device synchronization.
- Publish the finished static site on GitHub Pages for phone access.

## Review Focus

- A question bank with fewer than 50 eligible entries must not create a short or duplicated test; show a clear unavailable-test message. Test this in Task 3.
- Select-two questions must be scored by exact set equality, including partial, extra, and reversed-order selections. Test this in Task 3.
- Browser storage may be absent, full, or contain invalid/old data; the app must not falsely claim progress was saved or crash. Test this in Task 4.
- An unfinished test must survive reload without changing its 50 question IDs or losing saved answers. Test this in Task 4 and Task 5.
- Shuffling answer choices must not change which choices are correct or how prior answers are reviewed. Test this in Task 3 and Task 5.

---

## File Structure

- `index.html` — accessible page landmarks and app mount point.
- `src/main.js` — application startup, module wiring, and top-level error handling.
- `src/styles.css` — responsive visual system, phone-first layout, focus states, and reduced-motion handling.
- `src/question-bank.js` — question-bank loading and structural/content validation.
- `scripts/check-bank.mjs` — Node command-line validation of the question JSON.
- `src/revision.js` — deterministic test selection and spaced-review priority rules.
- `src/session.js` — answer selection, navigation state, submission, and score/review calculations.
- `src/progress-store.js` — versioned browser-local progress and active-session persistence.
- `src/ui.js` — rendering and event handling for home, test, results, and review screens.
- `data/questions.json` — normalized question content with stable IDs, answer IDs, lesson provenance, and official-source references.
- `data/content-audit.md` — official material consulted, date checked, and material discrepancies corrected from lesson notes.
- `tests/question-bank.test.js` — question schema, answer counts, IDs, and required fields.
- `tests/revision.test.js` — 50-question selection, priority tiers, uniqueness, and insufficient-bank behavior.
- `tests/session.test.js` — single/select-two scoring, navigation, submission, and result review.
- `tests/progress-store.test.js` — local persistence, invalid data, storage errors, and unfinished test restoration.
- `tests/ui.test.js` — DOM interaction checks for translation placement, answer selection, navigation, and end-of-test review.
- `package.json` — test and validation commands; jsdom is a development-only dependency, not shipped to learners.
- `.github/workflows/pages.yml` — GitHub Pages deployment from the default branch.
- `README.md` — local preview/testing, progress privacy, and deployment notes.

## Task 1: Create the static project foundation

**Files:**
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/styles.css`
- Create: `package.json`
- Create: `.gitignore`
- Create: `tests/ui.test.js`
- Create: `README.md`

**Interfaces:**
- Produces: A static HTML entry point loading `src/main.js` as an ES module, a responsive stylesheet, and `npm test` invoking `node --test`.
- No third-party runtime dependencies; the DOM test dependency is introduced in Task 5 only.

- [ ] **Step 1: Initialize a local Git repository and write the failing shell test** in `tests/ui.test.js` using Node built-ins to assert the document has a main landmark, an app mount point, viewport metadata, and a page title that does not imply government affiliation.
- [ ] **Step 2: Run `node --test tests/ui.test.js` and confirm it fails** because the page shell is absent.
- [ ] **Step 3: Implement the minimum page shell, module entry point, stylesheet reset/tokens, package scripts, and `.gitignore`** in the listed files. Include responsive viewport metadata, semantic landmarks, and visible keyboard focus styles.
- [ ] **Step 4: Run `node --test tests/ui.test.js` and confirm it passes.**
- [ ] **Step 5: Run `npm test` and confirm the test command discovers and passes the shell test; commit the project foundation.**

## Task 2: Build and audit the question bank

**Files:**
- Create: `src/question-bank.js`
- Create: `scripts/check-bank.mjs`
- Create: `data/questions.json`
- Create: `data/content-audit.md`
- Create: `tests/question-bank.test.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `loadQuestionBank(rawData) -> { questions, errors }` and `validateQuestion(question) -> string[]` from `src/question-bank.js`.
- Each question has `id`, `question`, `romanUrdu`, `choices` (four objects with stable `id` and `text`), `correctChoiceIds`, `answerType` (`single` or `select-two`), `lessonNumbers`, `explanation` (possibly empty), and `sources` (official source title, HTTPS URL, precise locator, and checked date).

- [ ] **Step 1: Write failing bank tests** for valid single-answer/select-two entries, duplicate IDs, missing Roman Urdu, choice counts other than four, invalid answer IDs, and answer counts inconsistent with `answerType`.
- [ ] **Step 2: Run `node --test tests/question-bank.test.js` and confirm it fails** because the validator and bank do not exist.
- [ ] **Step 3: Implement the validator and its schema** in `src/question-bank.js`; add `scripts/check-bank.mjs` and a `npm run check:bank` command that parses `data/questions.json` and reports every validation error.
- [ ] **Step 4: Identify the current official study material** and record its exact title/edition, publisher, accessible source reference, and access date in `data/content-audit.md` before using it as the answer authority.
- [ ] **Step 5: Extract and normalize all usable questions from supplied Lessons 1–17** into `data/questions.json`; consolidate exact/substantive repeats while preserving distinct useful wording and lesson provenance.
- [ ] **Step 6: Verify every included answer and relevant wording against the official guide or accessible current government/legal sources; correct discrepancies** and record each material correction with question ID, original lesson claim, corrected claim, and source locator in `data/content-audit.md`. Record unsupported claims as unverified and do not treat the lesson note alone as official verification.
- [ ] **Step 7: Add four unambiguous choices and a Latin-script Roman Urdu translation of each question only**; manually review select-two questions and distractors for accidental correctness or ambiguity.
- [ ] **Step 8: Run `npm run check:bank` and `node --test tests/question-bank.test.js`; confirm zero content/schema errors and all tests pass, then commit the question bank and audit.**

## Task 3: Implement test selection and session scoring

**Files:**
- Create: `src/revision.js`
- Create: `src/session.js`
- Create: `tests/revision.test.js`
- Create: `tests/session.test.js`

**Interfaces:**
- `selectTestQuestions(questions, progress, now, size = 50, random = Math.random) -> { questionIds, error }` in `src/revision.js`; injectable randomness makes selection tests deterministic.
- `createSession(questionIds) -> session` and `scoreSession(session, questionMap) -> result` in `src/session.js`.
- A session stores a stable ordered list of question IDs, selected choice IDs per question, and the current question index. Result entries contain question ID, selected IDs, correct IDs, and correctness.

- [ ] **Step 1: Write failing revision tests** for unseen priority, previous misses before other tiers, repeated-miss ranking, due correct reviews, randomization within a tier, no duplicates, exactly 50 IDs, and fewer-than-50 eligible questions.
- [ ] **Step 2: Run `node --test tests/revision.test.js` and confirm it fails** because selection is not implemented.
- [ ] **Step 3: Implement `selectTestQuestions`** with the four priority tiers from the spec; return a clear error rather than a partial test when fewer than 50 eligible unique questions exist.
- [ ] **Step 4: Run `node --test tests/revision.test.js` and confirm it passes.**
- [ ] **Step 5: Write failing session tests** for single-choice scoring, exact set scoring for select-two (including wrong partial/extra selections), navigation, answer revision, and complete result review.
- [ ] **Step 6: Run `node --test tests/session.test.js` and confirm it fails** before implementation.
- [ ] **Step 7: Implement session creation, answer updates, navigation bounds, submission, and scoring** in `src/session.js`; compare choice IDs as sets, never by visible order.
- [ ] **Step 8: Run `node --test tests/session.test.js` and confirm it passes, then commit the tested quiz logic.**

## Task 4: Save progress and unfinished tests locally

**Files:**
- Create: `src/progress-store.js`
- Create: `tests/progress-store.test.js`

**Interfaces:**
- `readProgress(storage) -> { progress, status }`, `writeProgress(storage, progress) -> { saved, error }`, and `recordCompletedTest(progress, result, now) -> progress` in `src/progress-store.js`.
- Store format is versioned and includes per-question attempts, total/consecutive incorrect counts, last-seen time, next-review time, and an optional unfinished session.
- Correct-answer intervals are 1, 3, 7, 14, then 30 days. A wrong answer restores next-test priority; after a correct retry, the interval sequence restarts.

- [ ] **Step 1: Write failing storage tests** for round-trip persistence, completed-test statistics, interval advancement, wrong-answer reset, corrupt JSON, unsupported storage, quota/write errors, and incompatible stored version.
- [ ] **Step 2: Run `node --test tests/progress-store.test.js` and confirm it fails** because the storage module is absent.
- [ ] **Step 3: Implement versioned parsing, safe reads/writes, progress updates, and serialization** in `src/progress-store.js`; expose save failure status to the caller.
- [ ] **Step 4: Run `node --test tests/progress-store.test.js` and confirm it passes.**
- [ ] **Step 5: Add a test proving an unfinished session restores the same ordered 50 IDs and saved selections** after constructing a new store instance from the same storage.
- [ ] **Step 6: Run `node --test tests/progress-store.test.js` again and confirm it passes, then commit the storage module.**

## Task 5: Connect the mobile practice interface

**Files:**
- Create: `src/ui.js`
- Modify: `src/main.js`
- Modify: `src/styles.css`
- Modify: `tests/ui.test.js`

**Interfaces:**
- `mountApp(root, dependencies) -> { render, destroy }` in `src/ui.js`.
- `dependencies` supplies the validated bank, selection/session functions, and progress store; the UI does not read/write browser storage directly.
- `src/main.js` loads the JSON bank, initializes dependencies, mounts the app, and displays a recoverable error if content cannot load or storage is unavailable.
- `jsdom` is a development-only dependency added here for DOM-level tests; it is not included in the published site.

- [ ] **Step 1: Add jsdom as a development-only dependency and write failing DOM tests** for home progress counts, English stem followed by Roman Urdu (without translated choices), single/select-two selection, question navigation, submit/results review, unavailable-bank messaging, and storage-save warning.
- [ ] **Step 2: Run `node --test tests/ui.test.js` and confirm the new assertions fail.**
- [ ] **Step 3: Implement home, question, result, and review views** in `src/ui.js`; render choices from stable IDs, save changes through the injected store, and preserve the active session.
- [ ] **Step 4: Connect startup and recoverable load/storage errors** in `src/main.js`.
- [ ] **Step 5: Complete the phone-first visual design** in `src/styles.css`, including large touch targets, readable Roman Urdu text, selected-state labels, keyboard focus, non-color status cues, and reduced-motion support.
- [ ] **Step 6: Run `node --test tests/ui.test.js` and `npm test`; confirm all tests pass.**
- [ ] **Step 7: Serve the static site locally and verify on a phone-sized viewport** that a learner can start, finish, review, refresh, and resume a 50-question test without horizontal overflow; commit the completed interface.

## Task 6: Publish and verify GitHub Pages

**Files:**
- Create: `.github/workflows/pages.yml`
- Modify: `README.md`

**Interfaces:**
- The Pages workflow deploys the static project from the repository's default branch without a build dependency.
- The published site contains only public app/question content; learner progress remains in browser storage and is never submitted.

- [ ] **Step 1: Write deployment documentation** in `README.md` describing local preview, tests, progress privacy, and the GitHub Pages setting/source required for deployment.
- [ ] **Step 2: Add a GitHub Actions Pages workflow** that uploads the static site and deploys it from the default branch using the official Pages actions and least-required permissions.
- [ ] **Step 3: Run `npm test` and `npm run check:bank`; confirm both pass before deployment.**
- [ ] **Step 4: Create a public GitHub repository for the finished static app, push the reviewed project branch, enable Pages, and wait for the workflow deployment to succeed.** The repo contains no learner progress; the site is intended to be publicly accessible by link.
- [ ] **Step 5: Open the published HTTPS link and smoke-test home, a 50-question run, select-two scoring, results, local persistence, phone layout, and the non-official-site notice; commit any workflow/documentation follow-up.**

## Self-review

- **Spec coverage:** Content and citations are Task 2; repeated/unseen/due selection and exact scoring are Task 3; device-local storage and resume are Task 4; phone, accessibility, review, and recoverable errors are Task 5; public HTTPS deployment is Task 6.
- **Step scan:** Each task starts with failing tests where behavior is deterministic, has an explicit implementation boundary, and ends with a runnable check. Content sourcing/translation includes a manual review because correctness and Roman Urdu fluency cannot be established by schema tests alone.
- **Type consistency:** Selection returns ordered question IDs plus an error; session state and progress storage both use stable question/choice IDs; the UI receives storage and logic through dependencies.
- **Review focus:** All five cases are assigned tests in their owning tasks.
- **Proportion:** Six tasks separate source-quality work, pure quiz logic, persistence, interface, and publication while keeping each deliverable usable and verifiable.
