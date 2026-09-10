export const normalizeName = (value: string) => value.trim().replace(/\s+/g, ' ')

export const validateName = (value: string) => {
  const name = normalizeName(value)
  if (!name) return 'Enter a player name.'
  if (name.length > 30) return 'Keep names to 30 characters or fewer.'
  return ''
}

export const validateSecret = (value: string) => {
  const word = value.trim()
  if (!word) return 'Enter a secret word.'
  if (/\s/.test(word)) return 'Use a single word for the secret.'
  if (!/[a-zA-Z]/.test(word)) return 'The secret must contain letters.'
  if (word.length > 40) return 'Keep the secret to 40 characters or fewer.'
  return ''
}

export const validatePrompt = (value: string, type: 'question' | 'guess') => {
  const prompt = value.trim()
  if (!prompt) return type === 'question' ? 'Enter a question.' : 'Enter a guess.'
  if (prompt.length > 180) return 'Keep it to 180 characters or fewer.'
  if (!/[a-zA-Z]/.test(prompt)) return 'Use words, not only numbers or symbols.'
  return ''
}
