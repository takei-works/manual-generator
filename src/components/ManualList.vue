<template>
  <div class="manual-list-container">
    <h2 class="manual-list-heading">📚 保存されたマニュアル一覧</h2>

    <div class="search-bar-wrapper">
      <input
        v-model="searchQuery"
        placeholder="🔍 キーワードで検索"
        @input="searchManuals"
        class="search-input"
      />
    </div>

    <div class="manual-cards">
      <div v-for="manual in manuals" :key="manual.id" class="manual-card">
        <router-link :to="`/manual/${manual.id}`" class="manual-title">
          📝 {{ manual.title }}
        </router-link>
        <div class="manual-timestamp">🕒 {{ manual.timestamp }}</div>
        <p class="manual-text">{{ manual.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import '@/assets/ManualList.css' // ✅ 正しい場所から読み込む（@ = src）

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
