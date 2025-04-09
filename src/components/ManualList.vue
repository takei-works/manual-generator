<template>
  <div>
    <h2>📚 保存されたマニュアル一覧</h2>

    <input
      v-model="searchQuery"
      placeholder="🔍 キーワードで検索"
      @input="searchManuals"
      style="margin-bottom: 1rem; padding: 4px; width: 300px;"
    />

    <ul>
      <li v-for="manual in manuals" :key="manual.id" style="margin-bottom: 1rem;">
        <router-link :to="`/manual/${manual.id}`">
          <strong>📝 {{ manual.title }}</strong>
        </router-link><br />
        <small>🕒 {{ manual.timestamp }}</small><br />
        <pre style="white-space: pre-wrap;">{{ manual.text }}</pre>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const manuals = ref([])
const searchQuery = ref('')

const fetchManuals = async (keyword = '') => {
  const res = await fetch(`http://localhost:3001/api/manuals/search?q=${encodeURIComponent(keyword)}`)
  manuals.value = await res.json()
}

onMounted(() => {
  fetchManuals()
})

const searchManuals = () => {
  fetchManuals(searchQuery.value)
}
</script>
