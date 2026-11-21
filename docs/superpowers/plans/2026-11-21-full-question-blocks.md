# Full Question Blocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish all 407 supplied questions in eight ordered study blocks, with separate mistake revision and safe browser-local progress.

**Architecture:** Retain the static app and its existing question-checking module. Add a study-block module, make revision selection exclude unseen questions, and deepen the progress module so session completion and migration share one tested seam. Keep original content inventory and verification evidence separate from the public bank; a complete-content check gates release.

**Tech Stack:** Existing JavaScript ES modules, Node's test runner, jsdom, browser localStorage, and GitHub Pages. No new runtime framework or hosted progress store.

**Spec:** `docs/superpowers/specs/2026-11-21-full-question-blocks-design.md` (approved). Read it and `CONTEXT.md` before implementation.

## Global Constraints

- All 407 original source positions remain represented; do not consolidate repeated questions.
- Study-block sizes are `[51, 51, 51, 51, 51, 51, 51, 50]`, in original source order. No revision insertion or shuffling.
- Separate revision rounds contain up to 51 distinct previously attempted questions; allow short rounds.
- Retain completed-test-based revision scheduling from current `main`, not the older checkout's calendar-day scheduling.
- Preserve question checking, answer locking, select-two correctness, and all-checked completion.
- Roman Urdu translates question stems only; choices remain English. Four unambiguous choices per question.
- Every released answer must have dated official evidence supporting its final wording. Unresolved source items block release; never silently omit them.
- Progress stays in the current browser; no accounts, uploads, synchronisation, or timer.
- Retain recoverable old history, protect unreadable storage, and confirm replacement of unfinished work.
- Publish to the existing `life-in-uk-practice` repository and Pages site only after verification.
- No unrelated architecture overhaul or visual redesign.

## Review Focus

1. A corrected answer or changed choice identity makes an old unfinished answer unsafe: preserve history and warn rather than silently re-score it.
2. A double click, result reload, or repeated completion call must not record attempts twice.
3. A blocked or corrupt storage read must not lead to a later write overwriting the original bytes.
4. A source item that cannot be verified must remain in the inventory and prevent a false “407 ready” release.
5. Finishing the final 50-question block or a short revision round must work without a hidden 51-question requirement.

Each condition has an explicit test in its owning task below.

## Execution setup and file map

Implementation needs an isolated worktree from freshly fetched `origin/main`; use the `using-git-worktrees` skill at execution time. GitHub `main` was verified as `fa5375304e343110beeb91c10086a46ad2958cec` during planning. Do not implement from this older feature checkout. Carry only these approved documents and `CONTEXT.md` into the implementation branch; do not merge the old application code over newer `main`.

Run `npm ci`, `npm test`, and `npm run check:bank` in the implementation worktree to establish the baseline. Record failures before making changes. No product dependency upgrades are part of this plan.

Files and responsibilities:

- `data/source-questions.json`: create immutable original 407-item inventory extracted from the supplied HTML.
- `scripts/import-source.mjs`: create data-only extraction/checking, never execute the HTML.
- `data/questions.json`: expand the existing runtime bank to 407 verified/corrected items.
- `data/legacy-question-map.json`: create explicit old-to-new question and choice identity mappings for safe migration.
- `data/audits/source-coverage.md`: create per-source-number coverage, corrections, unresolved blockers, and migration reasoning.
- `src/question-bank.js`: retain entry validation; add full-collection and migration-map validation.
- `scripts/check-bank.mjs`: retain ordinary validation and add an explicit full-collection release check.
- `src/study-blocks.js`: create fixed block membership and summary selection.
- `src/revision.js`: retain ranking/shuffling helpers; add separate revision selection.
- `src/session.js`: retain checking/scoring/navigation; carry session identity and mode.
- `src/progress-store.js`: own migration, restore validation, history, block completion, and exactly-once completion.
- `src/main.js`, `src/ui.js`, `src/styles.css`: wire the validated collection, progress, blocks, revision, confirmation, and accessible presentation.
- `tests/source-inventory.test.js`, `tests/study-blocks.test.js`: create focused tests.
- Existing bank, revision, session, progress-store, and UI tests: extend in place.
- `.github/workflows/pages.yml`: check before publishing and include the migration map in the artifact.
- `README.md`, `PRODUCT.md`, `data/content-audit.md`: update factual scope and user instructions only after the content is ready.

Do not add a general-purpose dependency-injection framework. Existing browser storage and in-memory test storage are the two real adapters at the persistence seam.

## Task 1: Preserve the original collection and expose a release gate

**Files:** Create `scripts/import-source.mjs`, `data/source-questions.json`, `tests/source-inventory.test.js`, `data/audits/source-coverage.md`; modify `src/question-bank.js`, `scripts/check-bank.mjs`, `tests/question-bank.test.js`, `package.json`.

**Interfaces:**
- `extractSourceQuestions(html: string) -> SourceQuestion[]` exported from `scripts/import-source.mjs`; records preserve `n`, `lesson`, `chapter`, `orig`, `q`, `ur`, `opt`, `a`, `x` and other original fields.
- CLI: `node scripts/import-source.mjs <input.html> <output.json>`; no output write on invalid input.
- Runtime bank entries add `sourceNumber: integer` in `1..407`; canonical IDs are `source-001` through `source-407`.
- `validateFullCollection(questions, inventory) -> string[]` supplements, rather than replaces, `loadQuestionBank`.
- `npm run check:bank:full` runs `node scripts/check-bank.mjs --full`; nonzero exit on incomplete or unconfirmed content.

- [x] Write extraction tests: 407 distinct numbered source entries survive a fixture import unchanged; malformed assignment, duplicate/missing number, invalid choice index, and code disguised as data are rejected without execution.
- [x] Write full-collection tests: 51 valid items still pass ordinary bank validation but fail the full gate; 407 valid synthetic items pass; duplicate source number, missing translation, wrong provenance, and `unconfirmed` item fail with the source number identified.

Test anchor (fixtures supply valid synthetic content):
```js
test('full release gate rejects partial content', () => {
  assert.notEqual(validateFullCollection(makeBank(51), inventory407).length, 0);
  assert.deepEqual(validateFullCollection(makeBank(407), inventory407), []);
});
```

- [x] Run `node --test tests/source-inventory.test.js tests/question-bank.test.js`; confirm failures are caused by the missing new behaviour.
- [x] Implement data-only extraction of the JSON array between the known assignment and closing delimiter using `JSON.parse`, not `eval` or a browser. Import `/home/ubuntu/research-reports/reports/life-in-uk-test-2026/life-in-uk-test-mcq.html`. Record its SHA-256 and extraction date in the audit. The committed inventory becomes the portable source of truth.
- [x] Implement the full gate and script command. Ordinary bank validation must continue supporting small test fixtures. Full checking also requires exact source-number coverage and that each declared source lesson appears in its corresponding runtime item's `lessonNumbers`.
- [x] Run the focused tests and ordinary bank check; expect pass. Run the full check on the existing partial bank; expect an explicit nonzero incomplete-content result, not an import crash.
- [x] Commit only Task 1 files: `feat: inventory all source questions and gate complete content`.

## Task 2: Prepare and verify the complete bank

**Files:** Modify `data/questions.json`, `data/audits/source-coverage.md`, existing `data/audits/lessons-*.md`, `data/content-audit.md`, `tests/question-bank.test.js`; create `data/legacy-question-map.json`.

**Interfaces:**
- Runtime entries retain the existing `question`, `romanUrdu`, `choices`, `correctChoiceIds`, `answerType`, `verificationStatus`, `lessonNumbers`, `explanation`, and `sources` schema, plus Task 1 source identities.
- Migration map format: `{ version: 1, mappings: [{ oldId, newId, choiceIds: { oldChoiceId: newChoiceId }, resumeSafe: boolean, reason: string }] }`.
- Each of the 51 old identities maps to one reviewed primary source occurrence, not every duplicate occurrence. Retain unmappable old history under its old identity; no invented mapping.

- [ ] Add bank tests asserting exactly 407 entries; source numbers `1..407`; IDs matching source numbers; nonempty Latin-script Roman Urdu without Urdu-script substitution; exactly four choices; valid single/select-two answers; and no internal correction warnings in learner explanations.
- [ ] Add migration-map tests: unique old identities; target identities and choice identities exist; `resumeSafe` mappings preserve the meaning and correctness of every choice. Explicitly test a changed correct answer marked unsafe.
- [ ] Export `validateLegacyQuestionMap(map, questions) -> string[]` from `src/question-bank.js` and include it in the full check. Structural tests cannot prove factual equivalence: record manual semantic review in each map entry's `reason`.

Test anchor:
```js
test('runtime collection retains every original source position', () => {
  assert.equal(bank.length, 407);
  assert.deepEqual(bank.map(q => q.sourceNumber).sort((a, b) => a - b),
    Array.from({ length: 407 }, (_, i) => i + 1));
  assert.ok(bank.every(q => q.romanUrdu.trim().length > 0));
});
```

- [ ] Run `node --test tests/question-bank.test.js`; confirm the incomplete bank fails the new full-coverage tests.
- [ ] Read the configured research access registry before online fetching. Use the applicable research skill and official sources; share source evidence across questions only when it supports each exact claim. Never treat generated text or the source HTML as independent verification.
- [ ] Work lesson-by-lesson from 1 through 17, retaining every original source number. Reuse the 51 audited items where supported, translate the 247 missing stems and review existing translations, repair choices and genuine select-two wording, and record official locators/check dates plus corrections per source number. Commit each completed lesson as `content: verify source questions for lesson N`.
- [ ] Review old-to-new mappings manually against question wording and choices. Do not infer matches from the old `lesson-N-qN` identity or similar text alone. Record all 51 old identities, including explicit unmappable exceptions in the coverage audit; do not fan out attempts across duplicates.
- [ ] If any item remains unresolved, document the precise claim, attempted official sources, and why responsible correction was not possible. Stop content release and report the blocker; do not weaken the gate.
- [ ] Run `npm run check:bank:full` and `node --test tests/question-bank.test.js`; both must pass before dependent release work. Perform a second factual/ambiguity/translation review of all 407 items and record coverage of that review in the audit.
- [ ] Commit the completed map and cross-lesson audit: `content: complete collection and document legacy identity mapping`.

## Task 3: Fixed study blocks and separate revision selection

**Files:** Create `src/study-blocks.js`, `tests/study-blocks.test.js`; modify `src/revision.js`, `tests/revision.test.js`.

**Interfaces:**
- `getStudyBlocks(questions) -> Array<{ id, number, start, end, questionIds }>`; IDs `block-1`..`block-8`; reject invalid full source coverage.
- `getNextStudyBlock(blocks, completedBlockIds) -> Block | null`.
- `selectRevisionQuestions(questions, progress = {}, size = 51, random = Math.random) -> { questionIds, error }`.
- Retain `selectTestQuestions` until old callers/tests are removed deliberately during wiring; it is not the new learner flow.

- [x] Write block tests asserting sizes `[51,51,51,51,51,51,51,50]`, flattened IDs equal source order, first range `1..51`, last range `358..407`, no overlap, and input-array order cannot change block membership. Assert completed blocks are skipped for “next”, all complete yields `null`, and blocks remain individually available.
- [x] Write revision tests: repeated misses rank ahead of other misses; recency breaks ranks; ranking ties use injectable randomness; due correct answers follow misses; unseen and not-yet-due correct questions are excluded; `0`, `1`, `50`, `51`, and `52` eligible questions yield `0`, `1`, `50`, `51`, and `51` unique IDs.
- [x] Test existing milestone behaviour at completed-test counts `0`, `1`, `3`, `7`, `14`, and `30`, including legacy attempted records without `nextReviewTest`.

Test anchor:
```js
test('blocks cover all source positions without overlap', () => {
  const blocks = getStudyBlocks(makeBank(407));
  assert.deepEqual(blocks.map(b => b.questionIds.length), [51,51,51,51,51,51,51,50]);
  assert.equal(new Set(blocks.flatMap(b => b.questionIds)).size, 407);
  assert.deepEqual([blocks[7].start, blocks[7].end], [358, 407]);
});
```

- [x] Run `node --test tests/study-blocks.test.js tests/revision.test.js`; verify red, implement minimal selection, rerun for green.
- [x] Keep current main's miss ordering and scheduling rules. The next test number is `(progress.completedTestCount ?? 0) + 1`; either mode will increment that same count only on completion. Empty revision selection returns `questionIds: []` with `error: null`, for an informational empty state.
- [x] Commit: `feat: select ordered blocks and separate revision rounds`.

## Task 4: Session identity, mode, and variable-size completion

**Files:** Modify `src/session.js`, `tests/session.test.js`.

**Interfaces:**
- Extend `createSession(questionIds, { id = crypto.randomUUID(), mode, blockId = null } = {})`; preserve existing session fields. New callers supply `mode: 'study' | 'revision'`; missing mode remains `'legacy'` for compatibility tests.
- Existing `updateAnswer`, `checkCurrentAnswer`, `moveToQuestion`, `scoreSession`, and `submitSession` retain their interfaces and propagate metadata.
- `mode: 'study'` carries its matching block ID; revision and legacy sessions carry no block ID.

- [x] Write tests asserting injected session identity and mode survive selecting, checking, navigation, and submission; separate calls generate different identities.
- [x] Write tests for one-question revision and the final 50-question study block: all checked permits completion, one unchecked prevents it, checked answers cannot change, and select-two requires exactly the pair. Empty sessions must not be submittable.

Test anchor:
```js
test('empty revision cannot be completed', () => {
  const session = createSession([], { id: 'round-1', mode: 'revision' });
  assert.equal(submitSession(session, new Map()).submitted, false);
});
```

- [x] Run `node --test tests/session.test.js`; verify red, implement metadata and empty-session protection, rerun for green without rewriting the existing scoring/checking algorithms.
- [x] Commit: `feat: identify study and revision sessions`.

## Task 5: Safe progress migration and exactly-once completion

**Files:** Modify `src/progress-store.js`, `tests/progress-store.test.js`.

**Interfaces:**
- Keep storage key `lifeinuk-progress-v1` to discover old progress; new payload has `version: 2`, `questions`, `activeSession`, `completedTestCount`, `completedBlockIds: []`, and `completedSessionIds: []`.
- Extend `readProgress(storage, { questions, legacyQuestionMap, blocks }) -> { progress, status, warning?, storageSnapshot }`; snapshot is the exact raw string or `null` for absent data. An unavailable read has no writable snapshot. Retain existing status names and introduce `migrated` for recoverable v1 data.
- Read/migration never writes. Preserve original bytes under `lifeinuk-progress-backup-v1` before the first replacement of v1 storage; if backup fails, fail the write and leave original progress intact.
- `writeProgress(storage, progress, { expectedSerialized }) -> { saved, error, storageSnapshot? }` compares the current raw value with the read snapshot immediately before writing and refuses on mismatch, unreadable storage, corrupt data, or an unsupported version. Require an explicit expected snapshot (including `null` on first save). On success return the new raw snapshot for the caller's next save. This detects normal cross-tab changes, not an atomic transaction across simultaneous tabs; do not promise cross-tab synchronisation.
- `recordCompletedSession(progress, session, questionMap, now = new Date()) -> { progress, result, error }` owns submission verification, history, count, block award, active-session clearing, and deduplication. Use existing `recordCompletedTest` history scheduling internally; UI must no longer call it directly.

- [ ] Write v1 migration tests for current records, older day-based records, explicit safe identity/choice remapping, retained unknown history, no invented block completions, and no read-time storage write. Retain `completedTestCount`; map old attempted records lacking `nextReviewTest` as due without inventing missed attempts.
- [ ] Write active-session restore tests for both new modes and safe legacy sessions. Validate unique known question IDs, valid choice IDs/counts, checked IDs, finite in-range integer position, mode and block membership. Reject a changed-answer unsafe legacy session while preserving history and producing a warning. Old sessions missing checked state gain `checkedQuestionIds: []`.
- [ ] Write corruption tests: malformed JSON, unsupported version, invalid v2 collections, throwing reads/writes, failed backup, and payload changed between read and write. Assert the original storage string is unchanged on protected failure.
- [ ] Write completion tests: incomplete/unknown/invalid study sessions return error and unchanged progress; a valid study completion updates one block and attempts; revision and legacy completion never award blocks. Duplicate calls with the same session ID leave all counts unchanged; replaying a block with a new session ID records a new attempt without duplicating its block ID.
- [ ] Assert completion clears only the matching active session, uses one completion count increment, and preserves main's review milestones `[1,3,7,14,30]` then another 30 tests after later milestones.

Test anchor (fixture is a valid, checked active revision session):
```js
test('completion is idempotent by session identity', () => {
  const { progress, session, questionMap } = completedRevisionFixture();
  const once = recordCompletedSession(progress, session, questionMap, fixedNow);
  const twice = recordCompletedSession(once.progress, session, questionMap, fixedNow);
  assert.equal(once.error, null);
  assert.deepEqual(twice.progress, once.progress);
  assert.deepEqual(once.progress.completedBlockIds, []);
  assert.equal(once.progress.completedTestCount, progress.completedTestCount + 1);
});
```

- [ ] Run `node --test tests/progress-store.test.js tests/session.test.js`; verify red, implement these behaviours in the progress module, rerun for green.
- [ ] Preserve original raw data on unrecoverable input; the user may practice in memory with a clear warning. Do not add an automatic reset/delete operation.
- [ ] Commit: `feat: migrate progress safely and record completion once`.

## Task 6: Wire the complete learner journey

**Files:** Modify `src/main.js`, `src/ui.js`, `src/styles.css`, `tests/ui.test.js`.

**Interfaces:**
- `startApp` fetches and validates the runtime bank and migration map from relative `data/` URLs; passes `getStudyBlocks`, `getNextStudyBlock`, `selectRevisionQuestions`, existing session operations, and the Task 5 progress functions to `mountApp`.
- Startup requires exact `1..407` runtime coverage and no unconfirmed item without downloading the research inventory. Pass the read snapshot into each write, advancing it only after a successful save. On a stale-data failure stop writes and explain that progress changed elsewhere; do not keep retrying with a new snapshot over another tab's work.
- Retain `mountApp(root, dependencies) -> { render, destroy }`; adapt existing test harness dependency names in the same task.
- UI actions: select block, next unfinished block, start revision, resume, confirm/cancel replacement, check, previous/next, finish, return home.

- [ ] Write UI tests with a synthetic 407-question bank: eight ranges and completion states; next unfinished block; individual block selection; last block's `50` count; all-complete state distinct from mastery; revision count equals Task 3 eligibility.
- [ ] Write UI tests for revision empty state, one-question completion, frequently wrong selection, independent block progress, and no unseen fill. Completing the final block must not require question 51.
- [ ] Write tests that starting either mode with an unfinished session opens accessible replacement confirmation; cancel leaves storage/session unchanged, confirm preserves completed history, and reload resumes the exact mode/order/answers/check states.
- [ ] Test duplicate finish clicks and remount after completion: history increments once, no active session returns, and revision never marks a block done. Test unavailable/corrupt storage warnings remain after answer changes, navigation, and completion.
- [ ] Test startup failures for invalid collection or mapping and fetch errors; require a visible startup error, not a partially usable bank. Test HTML escaping of question, translation, choice and feedback text.

Test anchor (extend existing harness with accessible-action helpers):
```js
test('revision never advances study-block coverage', () => {
  const app = makeHarness({ questions: makeBank(407), initialProgress: oneMissedQuestion() });
  app.startRevision();
  app.checkAndFinishRevision();
  assert.deepEqual(app.readProgress().completedBlockIds, []);
  assert.equal(app.readProgress().completedTestCount, 1);
});
```

- [ ] Run `node --test tests/ui.test.js`; verify failures describe missing block/revision flow.
- [ ] Implement UI wiring without duplicating ranking, block membership, or completion policy. Provide a labelled keyboard-operable confirmation with sensible focus restoration; retain check feedback focus, touch targets, non-colour status cues, and reduced-motion behaviour. Avoid fixed 50/51 assumptions in progress/results.
- [ ] Remove obsolete random-start wiring once all callers are migrated. Update narrow CSS only for block list and confirmation.
- [ ] Run `npm test` and `npm run check:bank:full`; expect all tests and full-content validation pass.
- [ ] Commit: `feat: present complete study blocks and mistake revision`.

## Task 7: Verify and publish the existing GitHub Pages app

**Files:** Modify `.github/workflows/pages.yml`, `README.md`, `PRODUCT.md`, `data/content-audit.md`.

**Interfaces:** Existing Pages publishing from `main`; public artifact includes `index.html`, `src/*.js`, `src/*.css`, `data/questions.json`, and `data/legacy-question-map.json`. Original inventory/audits need not ship to the browser.

- [ ] Add workflow checks before artifact upload: use Node 24, `npm ci`, `npm test`, and `npm run check:bank:full`. Preserve existing action versions and deployment permissions; include the migration map in the copied artifact.
- [ ] Update user documentation: all 407, seven blocks of 51 plus one of 50, separate revision, browser-only save limits, and verification evidence/limitations. Remove current claims that the finished collection has only 51 questions or missing lessons.
- [ ] Run `npm test`, `npm run check:bank:full`, and `git diff --check`. Record actual outputs, content count, and commit identity; do not substitute a synthetic-bank pass for real content verification.
- [ ] Serve the site locally with `python3 -m http.server 8081 --bind 127.0.0.1` in the worktree. Use the available browser tools to verify at approximately 360px and desktop width: no horizontal overflow, keyboard controls, select-two check/lock, final-block completion, short/empty revision, resume after reload, confirmation cancellation, and storage failure warnings. Use synthetic saved state only in the isolated local browser to shorten long journeys; never alter real learner storage.
- [ ] Review the whole implementation against both the approved spec and repository standards using the code-review skill. Fix findings and rerun affected checks. No content blocker may be accepted as a mere follow-up.
- [ ] Commit documentation/workflow, push the implementation branch to the existing repository, and open a pull request against `main`, linking the session to it. Follow the repository's merge requirements; merge only after checks/review are green and no unresolved blocker remains. Do not force-push or replace unrelated work.
- [ ] Confirm the Pages workflow succeeds for the merged commit. Open `https://thisisirfansbackup-cyber.github.io/life-in-uk-practice/`; verify eight correct block ranges, published bank count 407, migration map fetch, basic answer checking, and reload persistence in a fresh test profile.
- [ ] Report the repository link, pull request, deployed revision, live URL, verified question count, and any remaining limitations. Mark this step incomplete if deployment or published checks fail.

## Self-review and handoff

Coverage checked: content inventory and verification (1–2), block ranges and revision ranking (3), question checks and variable sizes (4), local storage/migration/idempotence (5), learner journey and accessibility (6), tested publishing (7). The five Review Focus conditions have explicit tests in Tasks 1–2 and 4–6.

Content preparation is the largest work item, not a trivial import. Lesson-sized commits provide checkpoints without pretending the whole collection is already verified. This plan produces one integrated update; deployment remains blocked until every required source item is ready.

Implementation has not begun. Review this plan before execution. Recommended execution: native implementation with focused independent review at the end, retaining content audit checkpoints across sessions if needed.
