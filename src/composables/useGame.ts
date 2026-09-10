import { computed, ref, watch } from 'vue'
import type { Answer, GameState, TurnType } from '../types/game'
import { normalizeName } from '../utils/validation'

const STORAGE_KEY = 'twenty-questions:v2'
const MAX_QUESTIONS = 20

const initialState = (): GameState => ({
  phase: 'setup',
  playerOne: '',
  playerTwo: '',
  secretWord: '',
  currentPrompt: '',
  currentType: null,
  history: [],
  questionsUsed: 0,
})

const loadState = (): GameState => {
  if (typeof window === 'undefined') return initialState()
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? { ...initialState(), ...JSON.parse(saved) } : initialState()
  } catch {
    return initialState()
  }
}

export const useGame = () => {
  const state = ref<GameState>(loadState())

  watch(
    state,
    (value) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  const questionsRemaining = computed(() => MAX_QUESTIONS - state.value.questionsUsed)
  const hasSavedGame = computed(() => state.value.phase !== 'setup')

  const start = (playerOne: string, playerTwo: string) => {
    state.value = {
      ...initialState(),
      phase: 'secret',
      playerOne: normalizeName(playerOne),
      playerTwo: normalizeName(playerTwo),
    }
  }

  const setSecret = (secretWord: string) => {
    state.value.secretWord = secretWord.trim()
    state.value.phase = 'handoff'
  }

  const beginGuessing = () => {
    state.value.phase = 'guessing'
  }

  const submitPrompt = (prompt: string, type: TurnType) => {
    const trimmed = prompt.trim()
    state.value.currentPrompt = trimmed
    state.value.currentType = type

    if (type === 'guess') {
      const correct = trimmed.localeCompare(state.value.secretWord, undefined, { sensitivity: 'accent' }) === 0
      state.value.phase = correct ? 'won' : 'answering'
      return
    }

    state.value.questionsUsed += 1
    state.value.phase = 'answering'
  }

  const answer = (answerValue: Answer) => {
    const prompt = state.value.currentPrompt
    const type = state.value.currentType
    if (!prompt || !type) return

    if (type === 'guess') {
      state.value.history.push({ id: crypto.randomUUID(), prompt, type, answer: 'no' })
    } else {
      state.value.history.push({ id: crypto.randomUUID(), prompt, type, answer: answerValue })
    }

    state.value.currentPrompt = ''
    state.value.currentType = null
    state.value.phase = state.value.questionsUsed >= MAX_QUESTIONS ? 'lost' : 'handoff'
  }

  const reset = () => {
    state.value = initialState()
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return {
    state,
    questionsRemaining,
    hasSavedGame,
    maxQuestions: MAX_QUESTIONS,
    start,
    setSecret,
    beginGuessing,
    submitPrompt,
    answer,
    reset,
  }
}
