// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import ManualList from './components/ManualList.vue'
import ManualDetail from './components/ManualDetail.vue'
import Recorder from './components/Recorder.vue'
import ChatBot from './components/ChatBot.vue'

const routes = [
  { path: '/', component: Recorder },
  { path: '/manuals', component: ManualList },
  { path: '/manual/:id', component: ManualDetail },
  { path: '/chat', component: ChatBot }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
