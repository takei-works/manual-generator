<template>
    <div class="page-container upload-container">
      <h2 class="upload-heading">📄 資料からマニュアル作成</h2>
  
      <form @submit.prevent="handleUpload" class="upload-form">
        <label class="upload-label">
          ファイルを選択（PDF / Word / TXT）
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            @change="handleFile"
            class="upload-input"
          />
        </label>
  
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
  import '@/assets/UploadManual.css' // ✅ 外部CSS読み込み
  
  const selectedFile = ref(null)
  const isLoading = ref(false)
  const error = ref('')
  const router = useRouter()
  
  const handleFile = (e) => {
    selectedFile.value = e.target.files[0]
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
  