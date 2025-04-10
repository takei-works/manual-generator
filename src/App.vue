<template>
  <div id="app">
    <header class="app-header">
      <div class="app-header-content">
        <div class="logo">🛠️ ManualGen</div>
        <nav class="nav-links">
          <router-link to="/" exact-active-class="active">🛠️ 作成</router-link>
          <router-link to="/manuals" exact-active-class="active">📚 一覧</router-link>
          <router-link to="/chat" exact-active-class="active">🤖 チャット</router-link>
        </nav>
      </div>
    </header>

    <main class="app-main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import './assets/AppHeader.css'
</script>

<style scoped>
.app-main-content {
  max-width: 960px;
  margin: 0 auto;
}
</style>
