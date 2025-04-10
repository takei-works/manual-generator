<template>
  <div class="page-container chat-container">
    <h2 class="chat-heading">🤖 作業マニュアルAIチャット</h2>

    <div class="chat-messages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['chat-bubble', msg.role === 'user' ? 'user' : 'ai']"
      >
        <span class="chat-label">
          {{ msg.role === 'user' ? '🧑 あなた' : '🤖 AI' }}
        </span>
        <div class="chat-content">{{ msg.content }}</div>
      </div>
    </div>

    <textarea
      v-model="userInput"
      @keydown.enter.prevent="sendMessage"
      rows="2"
      class="chat-input"
      placeholder="マニュアルに関する質問を入力..."
    />

    <button
      @click="sendMessage"
      :disabled="isLoading"
      class="chat-button"
    >
      {{ isLoading ? '考え中...' : '送信する' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import '@/assets/ChatView.css'

const userInput = ref('')
const isLoading = ref(false)
const messages = ref([])

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  const userMsg = userInput.value
  messages.value.push({ role: 'user', content: userMsg })
  userInput.value = ''
  isLoading.value = true

  try {
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg })
    })
    const data = await res.json()
    messages.value.push({ role: 'assistant', content: data.reply })
  } catch (e) {
    messages.value.push({ role: 'assistant', content: '⚠️ エラーが発生しました。' })
  } finally {
    isLoading.value = false
  }
}
</script>
