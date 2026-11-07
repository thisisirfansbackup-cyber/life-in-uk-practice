# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary learner is the user's brother, preparing for the Life in the UK test and practicing on his phone.

## Product Purpose

An independent practice site turns the user's lesson material into question-based study and helps the learner revisit unfamiliar or repeatedly missed material.

## Positioning

The practice is a 50-question learning session, longer than the official test. The site is not a government service or official test simulator.

## Operating Context

The learner opens a public GitHub Pages link on his phone. Roman Urdu appears beneath each English question to clarify the question stem; answer choices remain in English.

## Capabilities and Constraints

- Each session contains 50 distinct eligible questions when at least 50 verified or corrected questions are available.
- Missed and unseen questions receive priority; correct answers return on spaced intervals.
- Progress and unfinished sessions stay in the current browser's local storage. There are no accounts, cloud sync, or progress uploads.
- The question bank comes from the user's supplied lessons. Public official government, legal, and institutional sources are used where the complete paid official guide is inaccessible; unresolved claims are audited and excluded from verified practice.
- Learner-facing copy must not imply government affiliation or show internal correction warnings.

## Evidence on Hand

The current bank is in `data/questions.json`; sourcing limitations and material corrections are recorded in `data/content-audit.md` and `data/audits/`. The current 51-item bank is not yet comprehensive and does not yet represent lessons 2, 3, and 6.

## Product Principles

- Practice should be clear and useful on a phone.
- Review should focus on what the learner has not mastered yet.
- Answers and explanations should be honest about the limits of available evidence.
- Progress belongs to the learner's device.
- The service must remain clearly independent from the UK government.

## Accessibility & Inclusion

The interface must be usable by keyboard and touch, readable at phone sizes, expose selected and correct/incorrect states without relying on color alone, and respect reduced-motion preferences.
