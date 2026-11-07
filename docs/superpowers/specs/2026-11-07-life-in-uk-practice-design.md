# Life in the UK Practice App — Design Specification

**Status:** Approved  
**Date:** 2026-11-07

## Purpose

Create a polished, mobile-first practice website for the user's brother to study for the Life in the UK test. The site will turn the user's supplied Lessons 1–17 into a verified question bank and use his answers to concentrate practice on unfamiliar and difficult material.

The requested practice set contains 50 questions. It is intentionally longer than the official test format; the site must make clear that these are extended practice tests, not a simulation of the official test's question count.

## Agreed constraints

- Use only questions drawn from the supplied lessons. Do not add unrelated questions.
- Verify answers against the current official Life in the UK study material and correct discrepancies.
- Record sources and content corrections in project materials for quality control. Do not show correction warnings to the learner in the practice flow.
- Preserve questions that require two answers as select-two questions; both answers must be selected for a correct response.
- Provide four answer choices for every question.
- Show a Latin-script Roman Urdu translation of the question below its English text. Do not translate the answer choices.
- Each practice test contains exactly 50 distinct questions when the bank has at least 50 eligible questions.
- The test is exam-like: show the result and review after submission, rather than reveal correctness after every answer.
- Save progress on the learner's device/browser, with no account, server, or cross-device synchronization.
- Publish the finished static site on GitHub Pages for phone access.

### Source access limitation

The official 3rd-edition guide is not fully publicly accessible. As approved by the user, use accessible official government, legislation, statistics, and public-institution sources for checks; record source limitations and claims those sources cannot confirm in project audit materials. Correct confirmed discrepancies. Do not describe an unconfirmed lesson claim as independently verified.

## User experience

### Home and progress

The home screen gives the learner a clear way to start a 50-question test and summarizes progress, including unseen questions and questions needing revision. The site should communicate that saved progress belongs to the current browser/device and can be lost if its site data is cleared.

### Test flow

- Present one question at a time with an overall progress indicator and large, phone-friendly answer controls.
- Clearly indicate when a question requires one answer or two.
- Allow the learner to move between questions and revise answers before submitting.
- Save answers and test progress as the learner proceeds. Reopen an unfinished test after refresh or return to the site.
- No countdown timer is required in the first version; the requested 50-question practice is a learning tool, not an exact exam simulation.
- Avoid repeating a question within one test.

### Results and review

After submission, show the score and a review of questions with the learner's answer, the correct answer(s), and an explanation where reliable explanatory material is available. Keep each question's result available for future revision prioritization.

## Question bank and content quality

- Extract questions from the supplied Lessons 1–17.
- Consolidate exact or substantively equivalent repeats so that they do not crowd out other knowledge. Preserve distinct phrasings where they test a useful alternate formulation; retain lesson provenance for consolidated entries.
- Normalize every entry to a stable question identifier, English question, Roman Urdu question translation, four choices, correct choice identifier(s), single-answer/select-two type, lesson provenance, and any explanation.
- Verify the answer and relevant question wording against the current official Life in the UK study material. Store an identifiable source reference and the date checked with the project content/audit record.
- Correct discrepancies in the learner-facing answer and, where necessary, in the question wording. Keep an internal audit record of material corrections and sources, but do not display correction labels in the test experience.
- Check all answer choices for ambiguity: exactly one correct choice for single-answer questions and exactly two for select-two questions. Distractors must not accidentally be correct under the verified wording.
- Roman Urdu must be written in Latin script and translate only the question stem, not choices or answer explanations.

## Revision selection

Construct each 50-question test without duplicates using these priority tiers, randomized within a tier:

1. Questions missed on a previous attempt and not yet answered correctly afterward. Rank these by number of incorrect attempts (most first), then by recency; this ensures missed questions are eligible for the very next test.
2. Questions the learner has never attempted.
3. Previously answered questions that are due for spaced review, including questions answered correctly.
4. Remaining questions, to fill the test and retain variety.

Take questions in priority order until the test has 50 questions. A question is considered missed only when the selected answer set does not exactly match the verified correct answer set. Record attempts, consecutive/total incorrect counts, last-seen time, and next-review due time locally. After a correct answer, schedule spaced reviews at increasing intervals (1, 3, 7, 14, then 30 days); a subsequent incorrect answer returns the question to the next-test priority tier and restarts the correct-answer interval sequence after it is answered correctly again.

## Technical shape and publishing

- Build a static website that can be hosted on GitHub Pages without a server or learner account.
- Keep question content separate from presentation and test logic so the bank can be reviewed and corrected independently.
- Store learner progress and an unfinished test in the browser on the learner's device. Do not transmit learning history to GitHub Pages or any other service.
- Handle unavailable browser storage gracefully: explain that progress cannot be saved rather than silently claiming it was saved.
- Do not imply government affiliation or present the practice website as an official test service.
- Publish the completed site to GitHub Pages after the content and app pass the agreed checks.

## Accessibility and responsive design

- Optimize the primary experience for phone screens while remaining usable on desktop.
- Use readable type, clear visual hierarchy, strong contrast, and touch targets large enough for comfortable use.
- Make answer selection and navigation operable by keyboard as well as touch; expose selected and correct/incorrect states in a way assistive technology can identify.
- Respect reduced-motion preferences and do not rely on color alone to communicate status.

## Verification and release criteria

The first release is ready when:

1. Answers have been checked against accessible current official sources; confirmed discrepancies have been corrected, and source references/check dates plus any unresolved claims are recorded in the audit.
2. Every bank entry has four choices, a Roman Urdu translation of its question only, and a verified answer count matching its single-answer or select-two type.
3. A test contains 50 distinct questions when the available eligible bank contains at least 50.
4. Select-two scoring requires exactly both correct choices; single-answer scoring requires the one correct choice.
5. Repeatedly missed and unseen questions are prioritized, while questions answered correctly return at a lower spaced-review priority.
6. A learner can complete a test, see a correct end-of-test score and review, and continue an unfinished test after refreshing the page.
7. Progress remains available in the same browser after closing and reopening the site, and is not sent to an external service.
8. The layout and core test flow work at phone and desktop sizes and are keyboard-operable.
9. The published GitHub Pages link loads the finished site over HTTPS.

## Deliberately out of scope for the first version

- Accounts, cloud storage, and progress synchronization between devices.
- New question content beyond the supplied lessons.
- A timer or exact reproduction of the official exam experience.
- Native mobile applications, paid services, or server-side components.
- Publicly displaying content-correction notes to the learner.
