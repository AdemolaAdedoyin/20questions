export type GamePhase = 'setup' | 'secret' | 'handoff' | 'guessing' | 'answering' | 'won' | 'lost'
export type Answer = 'yes' | 'no' | 'sometimes'
export type TurnType = 'question' | 'guess'

export interface HistoryItem {
  id: string
  prompt: string
  type: TurnType
  answer?: Answer
}

export interface GameState {
  phase: GamePhase
  playerOne: string
  playerTwo: string
  secretWord: string
  currentPrompt: string
  currentType: TurnType | null
  history: HistoryItem[]
  questionsUsed: number
}
