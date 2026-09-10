import { describe, expect, it } from 'vitest'
import { normalizeName, validateName, validatePrompt, validateSecret } from './validation'

describe('validation', () => {
  it('normalizes player names', () => {
    expect(normalizeName('  Ade   Ademola ')).toBe('Ade Ademola')
  })

  it('requires valid player names', () => {
    expect(validateName('')).toBeTruthy()
    expect(validateName('Ade')).toBe('')
  })

  it('requires a single secret word containing letters', () => {
    expect(validateSecret('red fox')).toBeTruthy()
    expect(validateSecret('123')).toBeTruthy()
    expect(validateSecret('elephant')).toBe('')
  })

  it('validates questions and guesses', () => {
    expect(validatePrompt('', 'question')).toBeTruthy()
    expect(validatePrompt('Is it alive?', 'question')).toBe('')
    expect(validatePrompt('Elephant', 'guess')).toBe('')
  })
})
