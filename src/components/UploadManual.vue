<template>
  <div class="page-container upload-container">
    <h2 class="upload-heading">📄 資料からマニュアル作成</h2>

    <form @submit.prevent="handleUpload" class="upload-form">
      <div
        class="upload-dropzone"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="handleDrop"
        :class="{ active: dragOver }"
      >
        <template v-if="selectedFile">
          <div class="upload-file-info">
            <span>📎 {{ selectedFile.name }}</span>
            <button type="button" class="file-remove-btn" @click="clearFile">✖</button>
          </div>
        </template>
        <template v-else>
          <p>📂 ここにファイルをドロップ</p>
          <p style="font-size: 0.85rem;">または以下から選択</p>
        </template>

        <input
          type="file"
          accept=".pdf,.docx,.txt"
          @change="handleFile"
          class="upload-input"
        />
      </div>

      <button
        type="submit"
        :disabled="!selectedFile || isLoading"
        class="upload-button"
      >
        {{ isLoading ? 'アップロード中...' : 'アップロードして作成' }}
      </button>
    </form>

    <p v-if="error" class="upload-error">⚠️ {{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { manualDraft } from '@/store/manualDraft'
import '@/assets/UploadManual.css'

const selectedFile = ref(null)
const isLoading = ref(false)
const error = ref('')
const dragOver = ref(false)
const router = useRouter()

const handleFile = (e) => {
  selectedFile.value = e.target.files[0]
  error.value = ''
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file && /\.(pdf|docx|txt)$/i.test(file.name)) {
    selectedFile.value = file
    error.value = ''
  } else {
    error.value = '対応していないファイル形式です'
  }
  dragOver.value = false
}

const clearFile = () => {
  selectedFile.value = null
  error.value = ''
}

const handleUpload = async () => {
  if (!selectedFile.value) return

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  isLoading.value = true
  error.value = ''

  try {
    const res = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (data.error) {
      error.value = data.error
    } else {
      const autoTitle = data.text.split('\n')[0].slice(0, 20) || '無題マニュアル'
      manualDraft.value = { title: autoTitle, text: data.text }
      router.push('/manual/edit')
    }
  } catch (err) {
    error.value = 'アップロードに失敗しました'
  } finally {
    isLoading.value = false
  }
}
</script>
