---
version: 1
slug: "src-ui-js"
primary_target: "src/ui.js"
related_targets: ["src/main.js","src/styles.css"]
---

# Life in the UK practice surface

**Mode:** Operate

## Scope and task

One responsive study interface that lets the learner start or resume a 50-question practice test, answer one question at a time, and review the result after submission.

## Audience and constraints

The learner is the user's brother, primarily using a phone. Keep the current ink, paper, off-white surface, and teal accent system from `src/styles.css`. Keep controls familiar, keyboard accessible, clear at small sizes, and free of government affiliation claims.

## Content and states

Show the English question followed immediately by its Latin-script Roman Urdu translation. Keep choices in English. Home summarizes unseen and review-needed items; testing saves answers and the ordered question IDs locally; results show score, selected/correct answers, and available explanations. Surface short, recoverable messages for unavailable tests, storage failures, and question-load failures.

## Chosen direction

Extend the existing restrained study shell: the screen's visual hierarchy follows the learner's sequence—progress, one readable question, answer controls, then previous/next or submit. Use teal only for primary actions and selected state; keep explanatory and progress details neutral.

## Memorable moment

The learner sees a concise Roman Urdu clarification directly under the English prompt, without disrupting the flow or translating answer choices.

## Unresolved decisions

The question bank is an initial 51-item curated set, not comprehensive; lessons 2, 3, and 6 are not represented yet. Do not imply the practice pool covers every supplied lesson.
