// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import ManualList from './components/ManualList.vue'
import ManualDetail from './components/ManualDetail.vue'
import Recorder from './components/Recorder.vue'
import ChatBot from './components/ChatBot.vue'
import UploadManual from './components/UploadManual.vue'
import ManualEdit from './components/ManualEdit.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/record', component: Recorder },
  { path: '/manuals', component: ManualList },
  { path: '/manual/:id', component: ManualDetail },
  { path: '/chat', component: ChatBot },
  { path: '/upload', component: UploadManual },
  { path: '/manual/edit', component: ManualEdit }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
