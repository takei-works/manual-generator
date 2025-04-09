// backend/db.js
const Database = require('better-sqlite3')
const db = new Database('manuals.db')

// title を追加
db.prepare(`
  CREATE TABLE IF NOT EXISTS manuals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,       -- ← 追加
    text TEXT,
    timestamp TEXT
  )
`).run()

// embedding用テーブル
db.prepare(`
    CREATE TABLE IF NOT EXISTS manual_embeddings (
      manual_id INTEGER PRIMARY KEY,
      embedding TEXT
    )
  `).run()
  

module.exports = db
