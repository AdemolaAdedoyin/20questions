import { expect, test } from '@playwright/test'

test('players can start a game and submit a question', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Player 1').fill('Ade')
  await page.getByLabel('Player 2').fill('Jordan')
  await page.getByRole('button', { name: 'Start game' }).click()

  await page.getByLabel('Secret word').fill('elephant')
  await page.getByRole('button', { name: 'Lock in secret' }).click()
  await page.getByRole('button', { name: "I'm Jordan" }).click()

  await page.getByLabel('Question').fill('Is it alive?')
  await page.getByRole('button', { name: 'Ask question' }).click()
  await expect(page.getByText('Is it alive?')).toBeVisible()
})
