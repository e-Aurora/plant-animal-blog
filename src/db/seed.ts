// src/db/seed.ts
// Run this with: npx tsx src/db/seed.ts

import Database from "better-sqlite3";
import { hash } from 'bcryptjs';
import path from "path";

const dbFile = path.join(process.cwd(), "blog.db");
const db = new Database(dbFile);

async function seed() {
  console.log('🌱 Starting seed...');

  // Create a test user
  const hashedPassword = await hash('password123', 12);
  
  try {
    const userResult = db.prepare(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)'
    ).run('testuser', hashedPassword, 'test@example.com');

    const userId = userResult.lastInsertRowid as number;
    console.log('✅ Created user: testuser (password: password123)');

    // Create some test posts
    const posts = [
      {
        title: 'The Secret Life of Succulents',
        excerpt: 'Discover how these hardy plants survive in extreme conditions',
        content: `Succulents are fascinating plants that have adapted to survive in some of the harshest environments on Earth. Their thick, fleshy leaves store water, allowing them to thrive in arid climates where other plants would wither away.

These remarkable plants come in countless varieties, from the popular jade plant to the exotic lithops, also known as "living stones." Each species has developed unique adaptations to conserve water and protect themselves from the intense sun.

Growing succulents at home is relatively easy. They prefer bright light, well-draining soil, and infrequent watering. Overwatering is the most common mistake - these plants are much more tolerant of drought than excess moisture.`
      },
      {
        title: 'Monarch Butterfly Migration',
        excerpt: 'Follow the incredible journey of monarchs across North America',
        content: `Every year, millions of monarch butterflies embark on an extraordinary journey spanning thousands of miles. These delicate creatures travel from Canada and the United States to the oyamel fir forests of central Mexico, where they overwinter in massive colonies.

What makes this migration even more remarkable is that no single butterfly completes the entire round trip. It takes multiple generations to complete the cycle, yet somehow they return to the same forests their ancestors visited.

Scientists are still unraveling the mysteries of how monarchs navigate. They appear to use the sun's position combined with an internal compass to guide their journey. Conservation efforts are crucial as habitat loss threatens these incredible insects.`
      },
      {
        title: 'Indoor Air Purifying Plants',
        excerpt: 'Transform your home with these natural air cleaners',
        content: `NASA research has shown that certain houseplants can effectively remove toxins from indoor air. Plants like spider plants, peace lilies, and snake plants absorb harmful chemicals while releasing fresh oxygen.

The snake plant, or Sansevieria, is particularly impressive. It converts CO2 to oxygen at night, making it perfect for bedrooms. It's also incredibly low-maintenance, tolerating neglect better than most plants.

Peace lilies are excellent for removing mold spores from the air, making them ideal for bathrooms. They also signal when they need water by drooping slightly, then perk up within hours of watering.`
      },
      {
        title: 'Carnivorous Plants Care Guide',
        excerpt: 'Everything you need to know about growing these fascinating plants',
        content: `Carnivorous plants have evolved to trap and digest insects to supplement nutrients in poor soil conditions. Venus flytraps, pitcher plants, and sundews each use different strategies to capture prey.

Venus flytraps are perhaps the most famous, with their snap-trap leaves that close in milliseconds when triggered. Despite their reputation, they're quite delicate and require specific care. They need pure water (distilled or rainwater), bright light, and high humidity.

Pitcher plants use a different approach, luring insects into deep pitcher-shaped leaves filled with digestive enzymes. Some species can capture prey as large as small rodents! They make striking additions to any plant collection but require patience and attention to their specific needs.`
      }
    ];

    for (const post of posts) {
      db.prepare(
        'INSERT INTO posts (user_id, title, content, excerpt) VALUES (?, ?, ?, ?)'
      ).run(userId, post.title, post.content, post.excerpt);
    }

    console.log(`✅ Created ${posts.length} test posts`);
    console.log('\n🎉 Seed complete! You can now:');
    console.log('   - Login with username: testuser');
    console.log('   - Password: password123');
    console.log('   - View posts on the home page');
    
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      console.log('⚠️  Test user already exists. Seed data may already be present.');
    } else {
      console.error('❌ Error seeding database:', error);
    }
  }

  db.close();
}

seed();