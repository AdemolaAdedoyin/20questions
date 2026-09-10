import { beforeEach, describe, expect, it } from 'vitest'
import { useGame } from './useGame'

beforeEach(() => window.localStorage.clear())

describe('useGame', () => {
  it('moves through setup and secret selection', () => {
    const game = useGame()
    game.start('Ade', 'Jordan')
    expect(game.state.value.phase).toBe('secret')
    game.setSecret('elephant')
    expect(game.state.value.phase).toBe('handoff')
  })

  it('records answered questions', () => {
    const game = useGame()
    game.start('Ade', 'Jordan')
    game.setSecret('elephant')
    game.beginGuessing()
    game.submitPrompt('Is it alive?', 'question')
    game.answer('yes')
    expect(game.state.value.questionsUsed).toBe(1)
    expect(game.state.value.history[0]?.answer).toBe('yes')
  })

  it('wins on a case-insensitive correct guess', () => {
    const game = useGame()
    game.start('Ade', 'Jordan')
    game.setSecret('Elephant')
    game.beginGuessing()
    game.submitPrompt('elephant', 'guess')
    expect(game.state.value.phase).toBe('won')
  })
})
