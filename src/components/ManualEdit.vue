<template>
    <div class="manual-edit-container">
      <div class="manual-edit-inner">
        <h2 class="manual-edit-heading">📝 マニュアル作成</h2>
  
        <label class="manual-label">タイトル</label>
        <input v-model="title" class="manual-input" />
  
        <label class="manual-label">本文</label>
        <textarea v-model="text" class="manual-textarea" rows="10" />
  
        <button @click="save" class="manual-save-button">💾 保存する</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { manualDraft } from '@/store/manualDraft'
  
  const router = useRouter()
  
  const title = ref(manualDraft.value.title)
  const text = ref(manualDraft.value.text)
  
  const save = async () => {
    const res = await fetch('http://localhost:3001/api/manuals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title.value,
        text: text.value
      })
    })
  
    const result = await res.json()
    alert('保存しました！')
    router.push('/manuals')
  }
  </script>
  