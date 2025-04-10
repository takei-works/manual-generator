<template>
  <div id="app">
    <header class="app-header">
      <div class="app-header-content">
        <div class="logo">🛠️ ManualGen</div>
        <nav class="nav-links">
          <router-link to="/" exact-active-class="active">🎙️ 録音</router-link>
          <router-link to="/manuals" exact-active-class="active">📚 一覧</router-link>
          <router-link to="/chat" exact-active-class="active">🤖 チャット</router-link>
        </nav>
      </div>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import './assets/AppHeader.css'
</script>
