<template>
    <div style="max-width: 600px; margin: auto;">
      <h2>🤖 作業マニュアルAIチャット</h2>
  
      <div
        v-for="(msg, index) in messages"
        :key="index"
        style="margin-bottom: 1rem; white-space: pre-wrap;"
      >
        <strong>{{ msg.role === 'user' ? '🧑 あなた' : '🤖 AI' }}:</strong>
        <div>{{ msg.content }}</div>
      </div>
  
      <textarea
        v-model="userInput"
        @keydown.enter.prevent="sendMessage"
        rows="2"
        placeholder="マニュアルに関する質問を入力..."
        style="width: 100%; margin-bottom: 10px;"
      />
  
      <button @click="sendMessage" :disabled="isLoading">
        {{ isLoading ? '考え中...' : '送信する' }}
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
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
  