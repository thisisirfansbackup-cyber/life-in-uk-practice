import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const questions = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url), 'utf8'));
const key = 'lifeinuk-progress-v1';

test('secondary learner text meets the normal-text contrast minimum', async ({ page }) => {
  await page.goto('/');
  const contrast = await page.locator('.intro').evaluate(element => {
    const parse = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);
    const luminance = rgb => rgb.map(channel => channel / 255)
      .map(channel => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
      .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0);
    const foreground = luminance(parse(getComputedStyle(element).color));
    const background = luminance(parse(getComputedStyle(document.body).backgroundColor));
    const [lighter, darker] = [foreground, background].sort((a, b) => b - a);
    return (lighter + 0.05) / (darker + 0.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
});

test('keyboard checking and replacement preserve visible focus and modal containment', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to practice', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Continue with Block 1', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#question-heading')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('input').nth(0)).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page.locator('.answer-feedback')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Next question', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.question-count')).toHaveText('Question 2 of 51');

  await page.getByRole('link', { name: 'Life in the UK Practice home', exact: true }).focus();
  await page.keyboard.press('Enter');
  const trigger = page.locator('[data-block-id="block-2"]');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const cancel = page.getByRole('button', { name: 'Keep unfinished test', exact: true });
  const replace = page.getByRole('button', { name: 'Replace and start', exact: true });
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(replace).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('extra unchecked select-two choices remain resumable after a reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Continue with Block 1', exact: true }).click();
  for (let i = 0; i < 3; i++) await page.locator('input[type=checkbox]').nth(i).check();
  await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeDisabled();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Resume unfinished test', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Resume unfinished test', exact: true }).click();
  await expect(page.locator('input:checked')).toHaveCount(3);
  await page.locator('input[type=checkbox]').nth(2).uncheck();
  await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeEnabled();
});

test('a full study block, reload, result and short revision retain independent coverage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start revision', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('nothing to revise');
  await page.getByRole('button', { name: 'Continue with Block 1', exact: true }).click();
  for (let index = 0; index < 51; index++) {
    const question = questions[index];
    if (index === 42) {
      for (let i = 0; i < 3; i++) await page.locator('input[type=checkbox]').nth(i).check();
      await page.reload();
      await page.getByRole('button', { name: 'Resume unfinished test', exact: true }).click();
      await expect(page.locator('.question-count')).toHaveText('Question 43 of 51');
      await expect(page.locator('input:checked')).toHaveCount(3);
      await expect.poll(() => page.evaluate(storageKey =>
        JSON.parse(localStorage.getItem(storageKey)).activeSession.checkedQuestionIds.length, key)).toBe(42);
      for (const input of await page.locator('input[type=checkbox]').all()) await input.uncheck();
    }
    const selected = index === 1
      ? [question.choices.find(choice => !question.correctChoiceIds.includes(choice.id)).id]
      : question.correctChoiceIds;
    for (const id of selected) await page.locator(`input[value="${id}"]`).check();
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(page.locator('input:enabled')).toHaveCount(0);
    await page.getByRole('button', { name: index === 50 ? 'See results' : 'Next question', exact: true }).click();
  }
  await expect(page.locator('.score-line')).toContainText('50 / 51');
  await expect(page.locator('.review-item')).toHaveCount(51);
  await page.getByRole('button', { name: 'Back to study home', exact: true }).click();
  await expect(page.locator('.block-coverage')).toContainText('1 of 8');
  await page.getByRole('button', { name: 'Start revision · 1 question', exact: true }).click();
  await expect(page.locator('.question-count')).toHaveText('Question 1 of 1');
  for (const id of questions[1].correctChoiceIds) await page.locator(`input[value="${id}"]`).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await page.getByRole('button', { name: 'See results', exact: true }).click();
  await expect(page.locator('.score-line')).toContainText('1 / 1');
  await page.getByRole('button', { name: 'Back to study home', exact: true }).click();
  await expect(page.locator('.block-coverage')).toContainText('1 of 8');
  await page.reload();
  await expect(page.locator('.block-coverage')).toContainText('1 of 8');
  await page.getByRole('button', { name: 'Continue with Block 2', exact: true }).click();
  await page.getByRole('link', { name: 'Life in the UK Practice home', exact: true }).click();
  await page.locator('[data-block-id="block-3"]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Resume unfinished test', exact: true }).click();
  await expect(page.locator('.practice-mode')).toHaveText('Block 2');
});

test('a pre-update saved block reopens a corrected question without losing its other answers', async ({ page }) => {
  await page.addInitScript(({ storageKey, ids, previousAnswer }) => {
    localStorage.setItem(storageKey, JSON.stringify({
      version: 2, completedTestCount: 2, completedBlockIds: ['block-1'],
      completedSessionIds: ['earlier-test'],
      questions: { 'source-001': { attempts: 2, incorrectTotal: 1 } },
      activeSession: {
        id: 'pre-content-guard', mode: 'study', blockId: 'block-7',
        questionIds: ids, currentIndex: 38, submitted: false,
        answers: { 'source-343': previousAnswer, 'source-344': ['a', 'b'] },
        checkedQuestionIds: ['source-343', 'source-344'],
      },
    }));
  }, {
    storageKey: key, ids: questions.slice(306, 357).map(question => question.id),
    previousAnswer: questions[342].correctChoiceIds,
  });
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('questions were updated');
  await page.getByRole('button', { name: 'Resume unfinished test', exact: true }).click();
  await expect(page.locator('.question-count')).toHaveText('Question 38 of 51');
  await expect(page.locator('input:checked')).toHaveCount(0);
  await expect(page.locator('.session-notice')).toContainText('other answers are kept');
  for (const id of questions[343].correctChoiceIds) await page.locator(`input[value="${id}"]`).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(page.locator('input:enabled')).toHaveCount(0);
  const saved = await page.evaluate(storageKey => JSON.parse(localStorage.getItem(storageKey)), key);
  expect(saved.questions['source-001'].attempts).toBe(2);
  expect(saved.completedBlockIds).toEqual(['block-1']);
  expect(saved.activeSession.checkedQuestionIds).toEqual(['source-343', 'source-344']);
});
