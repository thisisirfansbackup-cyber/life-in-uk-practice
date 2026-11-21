# Full question collection, study blocks, and separate revision

**Status:** Approved and implemented on 2026-11-21. Published to GitHub Pages; see the implementation plan for the deployed revision and verification record.

## Purpose and supersession

Prepare the entire supplied 407-question collection for the learner, not a curated bank of 51 questions. Work through it in original order in 51-question study blocks, while revisiting mistakes in separate revision rounds. Publish the completed update to the existing GitHub repository and GitHub Pages site.

This specification supersedes the earlier design's random 50-question practice format and consolidation of repeated source items. Preserve earlier requirements for answer verification, Roman Urdu question translations, question checking, accessibility, local-only progress, and independent/non-government presentation unless explicitly changed here.

## Verified starting point

- Repository: `https://github.com/thisisirfansbackup-cyber/life-in-uk-practice`.
- Published app: `https://thisisirfansbackup-cyber.github.io/life-in-uk-practice/`.
- GitHub's default branch is `main`; its question collection contains only 51 entries as checked on 2026-11-21.
- The session checkout is an older feature branch. Implementation must start from current `main` and retain its question-checking and completed-test-based revision improvements.
- Source collection: `/home/ubuntu/research-reports/reports/life-in-uk-test-2026/life-in-uk-test-mcq.html`. Read-only parsing confirms 407 distinct source numbers, 1–407, with four choices each. Its lesson content is source material, not verification evidence.
- 247 source entries have no Roman Urdu question translation. The collection also contains ambiguous choices and weak distractors: it must not be copied into verified practice unchanged.
- The existing 51-question bank and content audits are reusable evidence, not proof that the remaining questions are correct.

## Agreed learner experience

### Study blocks

Present eight numbered blocks with their question ranges and completion state:

1. Questions 1–51.
2. Questions 52–102.
3. Questions 103–153.
4. Questions 154–204.
5. Questions 205–255.
6. Questions 256–306.
7. Questions 307–357.
8. Questions 358–407.

The normal next action advances to the next unfinished block. Blocks are visible and individually selectable; do not impose an additional unlocking rule. Preserve original question order within each block. Do not shuffle new questions or insert revision questions into a block. Completing a revision round must not complete or advance a study block.

Keep the current question-check interaction: select the required number of choices, check, see feedback, then advance. A checked answer is locked for the rest of that session. Completion requires checking every question, including all 50 in the final block. Incorrect answers do not prevent completion.

Show study-block coverage separately from correctness. Completing all eight blocks means all 407 questions were worked through; it does not imply mastery.

### Separate revision rounds

Offer a clearly labelled revision action independently of the next study block. Prioritise unresolved mistakes by repeated incorrect attempts, then recency, retaining the existing tie-breaking policy where applicable.

A round contains up to 51 distinct revision questions. Permit short rounds: do not fill them with unseen study questions merely to reach 51. When there is nothing to revise, explain this without creating an empty session.

Previously missed questions answered correctly may return for spaced revision using the current main-branch completed-test-based intervals. Do not replace this with calendar-day scheduling. A completed study block or revision round counts once as a completed test for that schedule.

On completion, update question history once. Merely checking a question or reopening a result must not double-count attempts. Revision correctness does not change the original block's question membership.

### Saved progress

Save question history, completed block identities, and an unfinished session in the same browser. Restore that session's mode, block identity where applicable, ordered question identities, position, selections, and checked state.

Retain the existing single-active-session model: resuming it is the primary action. Starting a different block or revision round must require confirmation before replacing unfinished work; keep completed history.

Preserve existing saved history wherever a reliable match exists between an old question and its source question. Retain stable existing identities when feasible and record explicit mappings when identities change. Do not infer an identity from similar text alone or invent historical block completions from old mixed-question tests.

Handle older unfinished mixed-question sessions safely: permit their completion when their question identities remain valid, without awarding a study-block completion. If a session cannot be restored, preserve the recoverable history and explain what happened.

Corrupt or incompatible stored data must not be silently overwritten. Storage failure must be visible; never claim progress was saved when it was not. No accounts, uploads, or cross-device synchronisation.

## Content preparation and quality

Retain all 407 original source positions and lesson provenance. Store the collection in the app repository so runtime use does not depend on the separate research checkout or HTML page. Do not collapse repeated source questions out of their blocks.

For each item:

- Preserve the source number and original wording in the audit trail.
- Supply an accurate English question and a Latin-script Roman Urdu question translation.
- Supply four unambiguous English choices and the correct choice identities.
- Preserve genuine select-two questions, requiring exactly both correct choices.
- Correct factual errors, ambiguous wording, and accidentally correct distractors without replacing the lesson's subject with unrelated content.
- Record a dated, identifiable official source supporting the final wording and answer. Reuse existing verified evidence only where it supports that exact claim.
- Keep sourcing and correction detail in audit material, not warnings attached to ordinary learner questions.

Do not label an unresolved claim verified. If any source item cannot be verified or responsibly corrected, retain its source position in the content inventory and report the blocker before release. Do not silently omit it, shrink a block, substitute an unrelated question, or announce that all 407 are ready. Resolving such a blocker may require a further user decision.

## Implementation scope

Evolve the existing static app rather than rebuild it. Keep content preparation, session behaviour, revision selection, saved progress, and presentation independently verifiable. Only restructure existing code where required for ordered study blocks, separate revision, or safe persistence.

Keep phone and keyboard usability, visible selected/checked states, accessible feedback, responsive layout, and the existing non-government notice. No timer, accounts, remote progress store, or unrelated visual redesign.

## Verification and release criteria

Automated checks must prove:

- Exactly 407 distinct source positions with valid content and provenance.
- Complete, non-overlapping block coverage with sizes `[51, 51, 51, 51, 51, 51, 51, 50]`.
- Stable order and no replacement of block questions by revision questions.
- Single-answer and select-two checking, answer locking, and completion gates.
- Revision prioritisation, short rounds, no duplicates, and an empty revision state.
- Correct per-question history and exactly-once completion recording.
- Independent block completion and revision progress.
- Reload/resume in both modes, old saved-data handling, and visible storage failures.
- Existing supported behaviour continues passing its tests.

Manually verify the complete study/revision journey at phone and desktop sizes, keyboard operation, and browser-local persistence.

Release only after content and behaviour pass: commit and push the implementation to the existing repository using its established review/deployment workflow, confirm a successful GitHub Pages deployment, and smoke-test the published site. Report the actual repository revision and content count. Do not claim a local change is already live.

## Next step

User review of this written specification, followed by an implementation plan that separates content preparation, behaviour changes, migration, and release verification into manageable work.
