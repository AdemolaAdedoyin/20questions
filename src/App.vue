<script setup lang="ts">
import { computed, ref } from 'vue'
import PassDevice from './components/game/PassDevice.vue'
import QuestionHistory from './components/game/QuestionHistory.vue'
import { useGame } from './composables/useGame'
import type { Answer, TurnType } from './types/game'
import { validateName, validatePrompt, validateSecret } from './utils/validation'

const game = useGame()
const playerOneInput = ref(game.state.value.playerOne)
const playerTwoInput = ref(game.state.value.playerTwo)
const secretInput = ref('')
const promptInput = ref('')
const promptType = ref<TurnType>('question')
const error = ref('')

const progress = computed(() => `${game.state.value.questionsUsed} / ${game.maxQuestions}`)
const isFinished = computed(() => ['won', 'lost'].includes(game.state.value.phase))
const finishedStatus = computed(() => {
  if (game.state.value.phase === 'won') {
    const count = game.state.value.questionsUsed
    return `Solved in ${count} question${count === 1 ? '' : 's'}`
  }

  return '20 questions used'
})

const submitPlayers = () => {
  error.value = validateName(playerOneInput.value) || validateName(playerTwoInput.value)
  if (!error.value) game.start(playerOneInput.value, playerTwoInput.value)
}

const submitSecret = () => {
  error.value = validateSecret(secretInput.value)
  if (!error.value) {
    game.setSecret(secretInput.value)
    secretInput.value = ''
  }
}

const submitPrompt = () => {
  error.value = validatePrompt(promptInput.value, promptType.value)
  if (!error.value) {
    game.submitPrompt(promptInput.value, promptType.value)
    promptInput.value = ''
  }
}

const answer = (value: Answer) => game.answer(value)

const reset = () => {
  game.reset()
  playerOneInput.value = ''
  playerTwoInput.value = ''
  secretInput.value = ''
  promptInput.value = ''
  error.value = ''
}
</script>

<template>
  <main class="app-shell">
    <header class="site-header">
      <a class="brand" href="#" @click.prevent="reset">20Q</a>
      <div v-if="game.state.value.phase !== 'setup'" class="status-group">
        <span>{{ isFinished ? finishedStatus : `${progress} questions` }}</span>
        <button class="text-button" type="button" @click="reset">New game</button>
      </div>
    </header>

    <section class="game-card" :class="{ 'game-card--compact': !['setup', 'guessing'].includes(game.state.value.phase) }">
      <div v-if="game.state.value.phase === 'setup'" class="setup-grid">
        <div class="intro">
          <p class="eyebrow">Classic game · Two players · One device</p>
          <h1>Can you figure it out in 20 questions?</h1>
          <p class="muted large">One player chooses a secret word. The other asks yes-or-no-style questions and gets twenty chances to narrow it down.</p>
          <div class="rules">
            <span>01</span><p>Pick a single secret word.</p>
            <span>02</span><p>Ask questions answered with Yes, No, or Sometimes.</p>
            <span>03</span><p>Guess correctly before question twenty.</p>
          </div>
        </div>

        <form class="panel" @submit.prevent="submitPlayers">
          <p class="eyebrow">Start a game</p>
          <label for="player-one">Player 1</label>
          <input id="player-one" v-model="playerOneInput" autocomplete="off" maxlength="30" placeholder="e.g. Ade" />
          <label for="player-two">Player 2</label>
          <input id="player-two" v-model="playerTwoInput" autocomplete="off" maxlength="30" placeholder="e.g. Jordan" />
          <p v-if="error" class="error" role="alert">{{ error }}</p>
          <button class="primary" type="submit">Start game</button>
        </form>
      </div>

      <form v-else-if="game.state.value.phase === 'secret'" class="center-panel" @submit.prevent="submitSecret">
        <p class="eyebrow">{{ game.state.value.playerOne }} · Your turn</p>
        <h1>Choose the secret word.</h1>
        <p class="muted">Keep the screen private. Use one word that {{ game.state.value.playerTwo }} can reasonably guess.</p>
        <label class="sr-only" for="secret">Secret word</label>
        <input id="secret" v-model="secretInput" autofocus autocomplete="off" maxlength="40" placeholder="Secret word" />
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <button class="primary" type="submit">Lock in secret</button>
      </form>

      <PassDevice
        v-else-if="game.state.value.phase === 'handoff'"
        :title="`Pass to ${game.state.value.playerTwo}`"
        :message="`${game.state.value.playerOne}'s secret is hidden. Hand over the device when you're ready.`"
        :button-label="`I'm ${game.state.value.playerTwo}`"
        @continue="game.beginGuessing"
      />

      <div v-else-if="game.state.value.phase === 'guessing'" class="play-layout">
        <form class="panel" @submit.prevent="submitPrompt">
          <div class="section-title-row">
            <div>
              <p class="eyebrow">{{ game.state.value.playerTwo }} · Your turn</p>
              <h1>What do you want to know?</h1>
            </div>
            <span class="counter">{{ game.questionsRemaining.value }} left</span>
          </div>

          <div class="segmented" aria-label="Turn type">
            <button type="button" :class="{ active: promptType === 'question' }" @click="promptType = 'question'">Ask a question</button>
            <button type="button" :class="{ active: promptType === 'guess' }" @click="promptType = 'guess'">Guess the word</button>
          </div>

          <label class="sr-only" for="prompt">{{ promptType === 'question' ? 'Question' : 'Guess' }}</label>
          <textarea id="prompt" v-model="promptInput" autofocus maxlength="180" :placeholder="promptType === 'question' ? 'Is it something you can hold?' : 'Enter your final guess'" />
          <p v-if="error" class="error" role="alert">{{ error }}</p>
          <button class="primary" type="submit">{{ promptType === 'question' ? 'Ask question' : 'Submit guess' }}</button>
        </form>
        <QuestionHistory :items="game.state.value.history" />
      </div>

      <div v-else-if="game.state.value.phase === 'answering'" class="center-panel">
        <p class="eyebrow">{{ game.state.value.playerOne }} · Your turn</p>
        <h1>{{ game.state.value.currentType === 'guess' ? `${game.state.value.playerTwo} guessed…` : `${game.state.value.playerTwo} asked…` }}</h1>
        <blockquote>{{ game.state.value.currentPrompt }}</blockquote>

        <template v-if="game.state.value.currentType === 'guess'">
          <p class="muted">That guess is not the secret word. Continue the round.</p>
          <button class="primary" type="button" @click="answer('no')">Continue</button>
        </template>
        <div v-else class="answer-grid">
          <button type="button" @click="answer('yes')">Yes</button>
          <button type="button" @click="answer('no')">No</button>
          <button type="button" @click="answer('sometimes')">Sometimes</button>
        </div>
      </div>

      <div v-else-if="game.state.value.phase === 'won'" class="center-panel result-panel">
        <span class="result-mark">✓</span>
        <p class="eyebrow">Correct</p>
        <h1>{{ game.state.value.playerTwo }} got it.</h1>
        <p class="result-summary">{{ finishedStatus }}</p>
        <p class="muted large">The secret word was <strong>{{ game.state.value.secretWord }}</strong>.</p>
        <button class="primary" type="button" @click="reset">Play again</button>
      </div>

      <div v-else class="center-panel result-panel">
        <span class="result-mark">20</span>
        <p class="eyebrow">Question limit reached</p>
        <h1>{{ game.state.value.playerOne }} wins this round.</h1>
        <p class="result-summary">All twenty questions were used.</p>
        <p class="muted large">The secret word was <strong>{{ game.state.value.secretWord }}</strong>.</p>
        <button class="primary" type="button" @click="reset">Play again</button>
      </div>
    </section>

    <footer>
      <span>Built with Vue 3 · TypeScript · Vite</span>
      <a href="https://github.com/AdemolaAdedoyin/20questions" target="_blank" rel="noreferrer">View source ↗</a>
    </footer>
  </main>
</template>
