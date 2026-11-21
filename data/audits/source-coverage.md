# Original source coverage

## Inventory provenance

- Extracted on 2026-11-21 from `life-in-uk-test-mcq.html` in the existing Life in the UK research collection.
- Original HTML SHA-256: `4b679124734f2153a33fdaacd2d4d914a8475078cad456f6a88247148ab7fc2b`.
- Portable original records: `data/source-questions.json`.
- Source numbers: 1–407, each represented exactly once, in original order.
- All source entries have four choices. 247 original question stems lack Roman Urdu.
- Original choices and answers are preserved as evidence of the supplied material, **not** asserted to be correct.

## Preparation status

Source questions 1–407 await the full per-item verification/correction and translation pass.
The existing runtime bank has 51 audited items; these have not yet been mapped to original source numbers.
No source item may be silently dropped or treated as verified merely because it appears in this inventory.

Run `npm run check:bank:full` to enforce full coverage before release. It intentionally fails while the runtime bank is incomplete.
The ordinary bank check continues to support the current partial app and small test fixtures.

## Per-item audit requirements

The preparation pass will record each source number's final runtime identity, original lesson,
official evidence and check date, translation review, corrections, unresolved claims, and any reviewed
legacy identity/choice mapping. Any unresolved source number blocks a claim that all 407 are ready.
