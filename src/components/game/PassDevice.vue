<script setup lang="ts">
defineProps<{ title: string; message: string; buttonLabel: string }>()
defineEmits<{ continue: [] }>()
</script>

<template>
  <div class="center-panel">
    <div class="pass-icon" aria-hidden="true">↔</div>
    <p class="eyebrow">Pass the device</p>
    <h1>{{ title }}</h1>
    <p class="muted">{{ message }}</p>
    <button class="primary" type="button" @click="$emit('continue')">{{ buttonLabel }}</button>
  </div>
</template>
