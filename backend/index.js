require('dotenv').config()
const express = require('express')
const db = require('./db')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const { OpenAI } = require('openai')

ffmpeg.setFfmpegPath(ffmpegPath)

const app = express()
const upload = multer({ dest: 'uploads/' })
const PORT = 3001

app.use(cors())
app.use(express.json())

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0)
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0))
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0))
  return dotProduct / (normA * normB)
}

const calculateEmbedding = async (text) => {
  const response = await openai.embeddings.create({
    input: text,
    model: 'text-embedding-ada-002'
  })
  return response.data[0].embedding
}

function convertToMp3(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath)
  })
}

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'ファイルがありません' })
    }

    const inputPath = path.resolve(__dirname, req.file.path)
    const outputPath = path.resolve(__dirname, 'uploads', `${req.file.filename}.mp3`)

    await convertToMp3(inputPath, outputPath)

    if (!fs.existsSync(outputPath)) {
      return res.status(500).json({ error: '変換された音声ファイルが見つかりません' })
    }

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(outputPath),
      model: 'whisper-1',
      language: 'ja'
    })

    fs.unlinkSync(inputPath)
    fs.unlinkSync(outputPath)
    res.json({ text: transcription.text })
  } catch (err) {
    res.status(500).json({ error: 'Transcription failed' })
  }
})

app.post('/api/manuals', async (req, res) => {
  const { title, text } = req.body
  const timestamp = new Date().toLocaleString()

  const stmt = db.prepare('INSERT INTO manuals (title, text, timestamp) VALUES (?, ?, ?)')
  const info = stmt.run(title, text, timestamp)

  const embedding = await calculateEmbedding(`${title}\n${text}`)
  db.prepare('INSERT INTO manual_embeddings (manual_id, embedding) VALUES (?, ?)').run(
    info.lastInsertRowid,
    JSON.stringify(embedding)
  )

  res.json({ id: info.lastInsertRowid, title, text, timestamp })
})

app.get('/api/manuals/search', (req, res) => {
  const keyword = req.query.q || ''
  const stmt = db.prepare(`
    SELECT * FROM manuals
    WHERE title LIKE ? OR text LIKE ?
    ORDER BY id DESC
  `)
  const rows = stmt.all(`%${keyword}%`, `%${keyword}%`)
  res.json(rows)
})

app.get('/api/manuals/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM manuals WHERE id = ?')
  const row = stmt.get(req.params.id)
  res.json(row)
})

app.put('/api/manuals/:id', (req, res) => {
  const { title, text } = req.body
  const stmt = db.prepare('UPDATE manuals SET title = ?, text = ? WHERE id = ?')
  stmt.run(title, text, req.params.id)
  res.json({ message: 'updated' })
})

app.post('/api/chat', async (req, res) => {
  const { message } = req.body

  const userEmbedding = await calculateEmbedding(message)

  const rows = db.prepare(`
    SELECT m.id, m.title, m.text, e.embedding
    FROM manuals m
    JOIN manual_embeddings e ON m.id = e.manual_id
  `).all()

  const scores = rows.map(row => {
    const embedding = JSON.parse(row.embedding)
    const score = cosineSimilarity(userEmbedding, embedding)
    return { ...row, score }
  })

  const topManuals = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const context = topManuals.map((m, i) => `【マニュアル${i + 1}】\nタイトル: ${m.title}\n内容:\n${m.text}`).join('\n\n')

  const prompt = `以下は製造現場の作業マニュアルです。\n${context}\n\nこの情報を元に、次の質問に日本語で簡潔に答えてください：\n「${message}」`

  const chatResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  })

  const reply = chatResponse.choices[0].message.content
  res.json({ reply })
})

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'ファイルがありません' })

    const filePath = path.resolve(__dirname, req.file.path)
    const ext = path.extname(req.file.originalname).toLowerCase()
    let text = ''

    if (ext === '.pdf') {
      const pdfParse = require('pdf-parse')
      const dataBuffer = fs.readFileSync(filePath)
      const data = await pdfParse(dataBuffer)
      text = data.text
    } else if (ext === '.docx') {
      const mammoth = require('mammoth')
      const data = await mammoth.extractRawText({ path: filePath })
      text = data.value
    } else if (ext === '.txt') {
      text = fs.readFileSync(filePath, 'utf8')
    } else {
      return res.status(400).json({ error: '対応していないファイル形式です（PDF, DOCX, TXT）' })
    }

    fs.unlinkSync(filePath) // アップロードファイル削除
    res.json({ text })
  } catch (err) {
    console.error('❌ アップロードエラー:', err)
    res.status(500).json({ error: 'アップロード処理中にエラーが発生しました' })
  }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Whisper API server is running on http://localhost:${PORT}`)
})
