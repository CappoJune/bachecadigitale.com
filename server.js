// Questo file configura il server Express per il blog collaborativo
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();

// Inizializza l'app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per gestire CORS, JSON e file statici
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configurazione per l'upload di immagini (limite 5MB, solo jpg/png/gif)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
      cb(null, true);
    } else {
      cb(new Error('Solo immagini JPG, PNG o GIF sono permesse'));
    }
  }
});

// Connessione al database SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Errore connessione database:', err.message);
  } else {
    console.log('Connesso al database SQLite.');
    // Crea tabelle se non esistono
    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      image TEXT,
      nickname TEXT,
      tags TEXT,
      likes INTEGER DEFAULT 0,
      reports INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS playbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      title TEXT,
      steps TEXT,
      examples TEXT,
      FOREIGN KEY (post_id) REFERENCES posts(id)
    )`);
  }
});

// Rotta per ottenere i post della bacheca (cronologico, più recenti prima)
app.get('/api/posts', (req, res) => {
  const query = 'SELECT * FROM posts ORDER BY created_at DESC';
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Errore nel recupero dei post' });
    } else {
      res.json(rows);
    }
  });
});

// Rotta per creare un nuovo post
app.post('/api/posts', upload.single('image'), (req, res) => {
  const { title, content, nickname, tags } = req.body;
  const image = req.file ? req.file.filename : null;
  const query = 'INSERT INTO posts (title, content, image, nickname, tags) VALUES (?, ?, ?, ?, ?)';
  db.run(query, [title, content, image, nickname, tags], function(err) {
    if (err) {
      res.status(500).json({ error: 'Errore nella creazione del post' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Rotta per mettere "Mi piace" a un post
app.post('/api/posts/:id/like', (req, res) => {
  const id = req.params.id;
  const query = 'UPDATE posts SET likes = likes + 1 WHERE id = ?';
  db.run(query, [id], (err) => {
    if (err) {
      res.status(500).json({ error: 'Errore nell\'aggiornamento del like' });
    } else {
      res.json({ success: true });
    }
  });
});

// Rotta per segnalare un post
app.post('/api/posts/:id/report', (req, res) => {
  const id = req.params.id;
  const query = 'UPDATE posts SET reports = reports + 1 WHERE id = ?';
  db.run(query, [id], (err) => {
    if (err) {
      res.status(500).json({ error: 'Errore nella segnalazione' });
    } else {
      res.json({ success: true });
    }
  });
});

// Rotta per promuovere un post al playbook (solo admin)
app.post('/api/playbook', (req, res) => {
  const { postId, title, steps, examples } = req.body;
  const query = 'INSERT INTO playbook (post_id, title, steps, examples) VALUES (?, ?, ?, ?)';
  db.run(query, [postId, title, steps, examples], (err) => {
    if (err) {
      res.status(500).json({ error: 'Errore nella promozione al playbook' });
    } else {
      res.json({ success: true });
    }
  });
});

// Rotta per ottenere il playbook
app.get('/api/playbook', (req, res) => {
  const query = 'SELECT * FROM playbook';
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Errore nel recupero del playbook' });
    } else {
      res.json(rows);
    }
  });
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
