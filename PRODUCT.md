# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary learner is the user's brother, preparing for the Life in the UK test and practicing on his phone.

## Product Purpose

An independent practice site turns the user's lesson material into question-based study and helps the learner revisit unfamiliar or repeatedly missed material.

## Positioning

The practice covers all 407 supplied questions in ordered study blocks, longer than the official test. The site is not a government service or official test simulator.

## Operating Context

The learner opens a public GitHub Pages link on his phone. Roman Urdu appears beneath each English question to clarify the question stem; answer choices remain in English.

## Capabilities and Constraints

- All 407 supplied source questions are represented in original order: seven blocks of 51 and a final block of 50.
- Revision rounds are separate from study blocks and prioritise previously missed questions, especially repeatedly missed ones.
- Progress, completed blocks, and unfinished sessions stay in the current browser's local storage. There are no accounts, cloud sync, or progress uploads.
- The question bank comes from the user's supplied lessons. Answers are checked against official government, legal, institutional, or museum sources; sourcing and corrections are audited.
- Learner-facing copy must not imply government affiliation or show internal correction warnings.

## Evidence on Hand

The complete runtime bank is `data/questions.json` (407 items). Original source records are in `data/source-questions.json`; per-lesson evidence is in `data/audits/`; sourcing limitations and material corrections are in `data/content-audit.md`.

## Product Principles

- Practice should be clear and useful on a phone.
- Review should focus on what the learner has not mastered yet.
- Answers and explanations should be honest about the limits of available evidence.
- Progress belongs to the learner's device.
- The service must remain clearly independent from the UK government.

## Accessibility & Inclusion

The interface must be usable by keyboard and touch, readable at phone sizes, expose selected and correct/incorrect states without relying on color alone, and respect reduced-motion preferences.
