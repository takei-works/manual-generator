<template>
  <div class="recorder-container">
    <div class="recorder-card">
      <h2 class="recorder-heading">🎙️ 音声でマニュアルを作成</h2>

      <div class="recorder-buttons">
        <button
          @click="startRecording"
          :disabled="isRecording"
          class="btn-record"
        >
          録音開始
        </button>
        <button
          @click="stopRecording"
          :disabled="!isRecording"
          class="btn-stop"
        >
          録音停止
        </button>
      </div>

      <div v-if="isLoading" class="loading-text">
        ⏳ AIが文字起こし中です...
      </div>

      <div v-if="error" class="error-text">
        ⚠️ エラー: {{ error }}
      </div>

      <textarea
        v-model="resultText"
        rows="8"
        readonly
        class="result-area"
        placeholder="変換されたテキストがここに表示されます"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import '../assets/Recorder.css'

let mediaRecorder = null
const audioChunks = []
const isRecording = ref(false)
const isLoading = ref(false)
const resultText = ref('')
const error = ref('')

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    audioChunks.length = 0

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data)
    }

    mediaRecorder.onstop = async () => {
      isLoading.value = true
      error.value = ''
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      const formData = new FormData()
      formData.append('audio', audioBlob, 'voice.webm')

      try {
        const response = await fetch('http://localhost:3001/api/transcribe', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) throw new Error('API通信エラー')

        const data = await response.json()
        resultText.value = data.text

        const autoTitle = data.text.split('\n')[0].slice(0, 20) || '無題マニュアル'

        await fetch('http://localhost:3001/api/manuals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: autoTitle,
            text: data.text
          })
        })
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    mediaRecorder.start()
    isRecording.value = true
  } catch (err) {
    error.value = 'マイクの使用が許可されていないか、デバイスに問題があります'
  }
}

const stopRecording = () => {
  mediaRecorder.stop()
  isRecording.value = false
}
</script>
