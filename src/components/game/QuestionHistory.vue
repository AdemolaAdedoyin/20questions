<script setup lang="ts">
import type { HistoryItem } from '../../types/game'

defineProps<{ items: HistoryItem[] }>()

const label = (answer?: string) => answer ? answer.charAt(0).toUpperCase() + answer.slice(1) : 'Incorrect guess'
</script>

<template>
  <section v-if="items.length" class="history" aria-labelledby="history-title">
    <div class="section-title-row">
      <h2 id="history-title">Round history</h2>
      <span>{{ items.length }} turn{{ items.length === 1 ? '' : 's' }}</span>
    </div>
    <ol>
      <li v-for="(item, index) in items" :key="item.id" :class="{ 'history-guess': item.type === 'guess' }">
        <div>
          <span class="history-index">{{ index + 1 }}</span>
          <div class="history-copy">
            <span class="history-kind">{{ item.type === 'guess' ? 'Guess' : 'Question' }}</span>
            <p>{{ item.prompt }}</p>
          </div>
        </div>
        <span class="answer-pill">{{ item.type === 'guess' ? 'Incorrect' : label(item.answer) }}</span>
      </li>
    </ol>
  </section>
</template>
