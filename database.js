const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

class Database {
  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'memos.db');
    this.db = new sqlite3.Database(dbPath);
  }

  initialize() {
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS memos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });
    console.log('Database initialized');
  }

  getAllMemos() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM memos ORDER BY updated_at DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  addMemo(memo) {
    return new Promise((resolve, reject) => {
      const { title, content } = memo;
      this.db.run(
        'INSERT INTO memos (title, content) VALUES (?, ?)',
        [title, content],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, title, content });
          }
        }
      );
    });
  }

  updateMemo(memo) {
    return new Promise((resolve, reject) => {
      const { id, title, content } = memo;
      this.db.run(
        'UPDATE memos SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, content, id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({ id, title, content });
          }
        }
      );
    });
  }

  deleteMemo(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM memos WHERE id = ?', [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ id });
        }
      });
    });
  }
}

module.exports = Database;
