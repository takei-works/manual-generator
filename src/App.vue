<template>
  <div id="app">
    <nav style="margin-bottom: 1rem;">
      <router-link to="/">🎙️ 録音</router-link> |
      <router-link to="/manuals">📚 一覧</router-link> |
      <router-link to="/chat">🤖 チャット</router-link>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
</script>
