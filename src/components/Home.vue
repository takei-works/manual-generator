<template>
    <div class="home-container">
      <h2 class="home-heading">🛠️ 作業マニュアルの作成方法を選んでください</h2>
  
      <div class="home-options">
        <router-link to="/record" class="home-card">
          🎙️ 音声で作成する
        </router-link>
  
        <router-link to="/upload" class="home-card">
          📄 資料から作成する
        </router-link>

        <router-link to="/manual/create" class="home-card">
        ✍️ テキストで作成する
        </router-link>

      </div>
    </div>
  </template>
  
  <script setup>
  import '@/assets/Home.css'
  </script>
  