<template>
  <div v-if="manual" class="manual-edit-container">
    <div class="manual-edit-inner">
      <h2 class="manual-edit-heading">📝 マニュアル編集</h2>

      <label class="manual-label">タイトル</label>
      <input v-model="manual.title" class="manual-input" />

      <label class="manual-label">本文</label>
      <textarea v-model="manual.text" class="manual-textarea" rows="10" />

      <button @click="save" class="manual-save-button">💾 保存する</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '@/assets/ManualDetail.css'

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
