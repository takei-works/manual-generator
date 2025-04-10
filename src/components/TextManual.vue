<template>
    <div class="manual-edit-container">
      <div class="manual-edit-inner">
        <h2 class="manual-edit-heading">✍️ テキスト入力でマニュアル作成</h2>
  
        <label class="manual-label">タイトル</label>
        <input v-model="title" class="manual-input" placeholder="例：加工機の始動手順" />
  
        <label class="manual-label">本文</label>
        <textarea
          v-model="text"
          class="manual-textarea"
          rows="10"
          placeholder="ここにマニュアルの内容を入力してください"
        />
  
        <button @click="save" class="manual-save-button">💾 保存する</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const title = ref('')
  const text = ref('')
  const router = useRouter()
  
  const save = async () => {
    if (!title.value.trim() || !text.value.trim()) {
      alert('タイトルと本文を入力してください')
      return
    }
  
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
  
    await res.json()
    alert('保存しました！')
    router.push('/manuals')
  }
  </script>
  