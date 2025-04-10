<template>
    <div>
      <h2>音声でマニュアルを作ろう</h2>
      <button @click="startRecording" :disabled="isRecording">🎙️ 録音開始</button>
      <button @click="stopRecording" :disabled="!isRecording">🛑 録音停止</button>
      <p>変換されたテキスト：</p>
      <textarea v-model="resultText" rows="10" cols="50" readonly />
  
      <p v-if="isLoading">⏳ AIが文字起こし中です...</p>
      <p v-if="error" style="color: red;">⚠️ エラー: {{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
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
        console.log('📦 Blob サイズ:', audioBlob.size)
        console.log('📦 Blob タイプ:', audioBlob.type)

        const formData = new FormData()
        formData.append('audio', audioBlob, 'voice.webm')
        console.log('🚀 APIに送信開始')
  
        try {
          const response = await fetch('http://150.91.166.122:3001/api/transcribe', {
            method: 'POST',
            body: formData,
            headers: {
                // multipart/form-dataは boundary付きになるため、明示指定しない！
            }
          })
  
          if (!response.ok) throw new Error('API通信エラー')
  
          const data = await response.json()
          resultText.value = data.text

          // 自動タイトル生成（最初の1行 or 10文字）
          const autoTitle = data.text.split('\n')[0].slice(0, 20) || '無題マニュアル'

          // DBに保存（POST）
          await fetch('http://150.91.166.122:3001/api/manuals', {
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
  