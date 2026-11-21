# Original source coverage

## Inventory provenance

- Extracted on 2026-11-21 from `life-in-uk-test-mcq.html` in the existing Life in the UK research collection.
- Original HTML SHA-256: `4b679124734f2153a33fdaacd2d4d914a8475078cad456f6a88247148ab7fc2b`.
- Portable original records: `data/source-questions.json`.
- Source numbers: 1–407, each represented exactly once, in original order.
- All source entries have four choices. 247 original question stems lack Roman Urdu.
- Original choices and answers are preserved as evidence of the supplied material, **not** asserted to be correct.

## Preparation status

Prepared and verified so far: source questions **1–72** (lessons 1–3), in `data/prepared/lesson-01.json` through `lesson-03.json`. Lessons 2 repeats lesson 1's topics but keeps its own 24 source positions and identities.

Remaining: source questions **73–407** await the same per-item verification/correction and translation pass.
The existing 51-item published bank is archived for migration review at `data/audits/legacy-published-bank.json`.
No source item may be silently dropped or treated as verified merely because it appears in this inventory.

Run `npm run check:bank:full` to enforce full coverage before release. It intentionally fails while the runtime bank is incomplete.
The ordinary bank check continues to support the current partial app and small test fixtures.

## Legacy published-bank review

The previously published 51-question bank was reviewed against the original collection. 45 identities have a reviewed mapping to one primary source occurrence in `data/legacy-question-map.json`; two of those (jury age and jury selection) preserve enough choice meaning to resume an old answer, and the rest retain history without restoring answers.

Six old identities have no reliable original-source occurrence and are deliberately **not** mapped. Their history remains under the old identity rather than being guessed onto a similar question:

- `lesson-7-q7` — smoking in a smoke-free place (no exact original item).
- `lesson-9-q3` — highest Bank of England note (no exact original item).
- `lesson-12-q6` — responsibility for local services (no exact original item).
- `lesson-14-q8` — Hansard (no exact original item).
- `lesson-14-q13` — Stonehenge county (no exact original item).
- `lesson-15-q6` — 1918 Armistice time (no exact original item).

An unfinished old mixed-question test can resume only when every one of its questions maps safely. Otherwise it is dropped with a warning and completed history is retained.

## Per-item audit requirements

The preparation pass will record each source number's final runtime identity, original lesson,
official evidence and check date, translation review, corrections, unresolved claims, and any reviewed
legacy identity/choice mapping. Any unresolved source number blocks a claim that all 407 are ready.
