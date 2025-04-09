<template>
    <div v-if="manual">
      <h2>📝 マニュアル編集</h2>
      <label>タイトル:</label><br />
      <input v-model="manual.title" style="width: 400px; margin-bottom: 1rem;" /><br />
      <label>本文:</label><br />
      <textarea v-model="manual.text" rows="10" cols="60" /><br /><br />
      <button @click="save">💾 保存する</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  
  const route = useRoute()
  const router = useRouter()
  const manual = ref(null)
  
  onMounted(async () => {
    const res = await fetch(`http://localhost:3001/api/manuals/${route.params.id}`)
    manual.value = await res.json()
  })
  
  const save = async () => {
    await fetch(`http://localhost:3001/api/manuals/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(manual.value)
    })
    alert('保存しました！')
    router.push('/manuals')
  }
  </script>
  