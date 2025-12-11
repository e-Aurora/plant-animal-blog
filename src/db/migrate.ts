// src/db/migrate.ts
// Run with: npx tsx src/db/migrate.ts

import Database from "better-sqlite3";
import path from "path";

const dbFile = path.join(process.cwd(), "blog.db");
const db = new Database(dbFile);

function migrate() {
  console.log('🔄 Starting database migration...');

    // Add created_at to users if it doesn't exist
    try{
      db.prepare(`ALTER TABLE follows ADD COLUMN id INTEGER PRIMARY KEY`).run();
      console.log("✅ Added id column to follows");

      db.prepare(`UPDATE follows SET id = rowid WHERE id IS NULL`).run();
      console.log("✅ Updated existing rows with unique ids");
    } catch (e: any) {
      if (e.message.includes("duplicate column name")) {
        console.log("ℹ️ id column already exists in follows, skipping");
      } else {
        throw e;
      }
    /*try {
  // 1️⃣ Önce sütunu ekle (default olmadan)
  db.prepare(`ALTER TABLE users ADD COLUMN created_at DATETIME`).run();
  console.log("✅ Added created_at column to users");

  // 2️⃣ Mevcut kayıtları CURRENT_TIMESTAMP ile güncelle
  db.prepare(`UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL`).run();
  console.log("✅ Updated existing rows with current timestamp");

} catch (e: any) {
  // Eğer sütun zaten varsa, hata atlamasını sağla
  if (e.message.includes("duplicate column name")) {
    console.log("ℹ️ created_at column already exists, skipping");
  } else {
    throw e;
  }
}*/
/*
    // Make email unique (recreate table if needed)
    const usersHasUniqueEmail = db.prepare(`
      SELECT sql FROM sqlite_master 
      WHERE type='table' AND name='users'
    `).get() as { sql: string };
    
    if (!usersHasUniqueEmail.sql.includes('email TEXT UNIQUE')) {
      console.log('🔄 Making email unique...');
      db.exec(`
        BEGIN TRANSACTION;
        
        CREATE TABLE users_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          email TEXT UNIQUE,
          avatar_emoji TEXT DEFAULT '🌿',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        INSERT INTO users_new (id, username, password, email, avatar_emoji)
        SELECT id, username, password, email, 
               COALESCE(avatar_emoji, '🌿')
        FROM users;
        
        DROP TABLE users;
        ALTER TABLE users_new RENAME TO users;
        
        COMMIT;
      `);
      console.log('✅ Email is now unique');
    }

    // Create comment_likes table
    db.exec(`
      CREATE TABLE IF NOT EXISTS comment_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comment_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(comment_id, user_id),
        FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Created comment_likes table');

    // Create tags table
    db.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created tags table');

    // Create post_tags table
    db.exec(`
      CREATE TABLE IF NOT EXISTS post_tags (
        post_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Created post_tags table');

    // Create follows table
    db.exec(`
      CREATE TABLE IF NOT EXISTS follows (
        follower_id INTEGER NOT NULL,
        following_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (follower_id, following_id),
        FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
        CHECK (follower_id != following_id)
      );
    `);
    console.log('✅ Created follows table');

    // Create notifications table
    db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        actor_id INTEGER NOT NULL,
        post_id INTEGER,
        comment_id INTEGER,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Created notifications table');

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)',
      'CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id)',
      'CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id)',
      'CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id)',
      'CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id)',
      'CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id)',
      'CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)'
    ];

    indexes.forEach(sql => db.exec(sql));
    console.log('✅ Created all indexes');

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }*/ finally {
    db.close();
  }
}

migrate();