import db from './schema';
import bcrypt from 'bcryptjs';

// Seed dummy data
export function seedDatabase() {
  // Check if already seeded
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) return;

  // Seed demo user
  const hashedPassword = bcrypt.hashSync('demo1234', 10);
  db.prepare(`
    INSERT INTO users (email, password, name, is_subscribed)
    VALUES (?, ?, ?, ?)
  `).run('demo@moneysignal.app', hashedPassword, 'Demo User', 1);

  // Seed signals (economic events)
  const signals = [
    { title: 'Fed Rate Decision', content: 'Federal Reserve maintains rates at 5.25%. Markets respond positively. Consider reviewing fixed-income allocations.', signal_type: 'monetary', impact: 'high' },
    { title: 'CPI Data Release', content: 'Inflation at 3.2% YoY, slightly below expectations. Good news for rate-sensitive assets.', signal_type: 'inflation', impact: 'medium' },
    { title: 'Jobs Report', content: 'Non-farm payrolls: +180K. Unemployment steady at 3.9%. Labor market remains resilient.', signal_type: 'employment', impact: 'medium' },
  ];

  const insertSignal = db.prepare('INSERT INTO signals (title, content, signal_type, impact) VALUES (?, ?, ?, ?)');
  signals.forEach(s => insertSignal.run(s.title, s.content, s.signal_type, s.impact));

  // Seed channels
  const channels = [
    { name: 'Market Insights', description: 'Daily market analysis and trends', icon: '📊' },
    { name: 'Crypto Watch', description: 'Cryptocurrency news and signals', icon: '₿' },
    { name: 'Global Macro', description: 'Macroeconomic events worldwide', icon: '🌍' },
  ];

  const insertChannel = db.prepare('INSERT INTO channels (name, description, icon) VALUES (?, ?, ?)');
  channels.forEach(c => insertChannel.run(c.name, c.description, c.icon));

  // Seed channel posts
  const posts = [
    { channel_id: 1, title: 'Weekly Market Recap', content: 'S&P 500 up 2.3% this week. Tech leads gains. Energy sector lags.' },
    { channel_id: 1, title: 'Earnings Season Preview', content: 'Big Tech earnings next week. Watch AAPL, MSFT, GOOGL closely.' },
    { channel_id: 2, title: 'BTC Halving Approaching', content: 'Bitcoin halving expected in April. Historical patterns suggest volatility ahead.' },
    { channel_id: 3, title: 'ECB Policy Update', content: 'European Central Bank signals potential rate cuts in Q2.' },
  ];

  const insertPost = db.prepare('INSERT INTO channel_posts (channel_id, title, content) VALUES (?, ?, ?)');
  posts.forEach(p => insertPost.run(p.channel_id, p.title, p.content));

  // Seed groups
  const groups = [
    { name: 'Beginner Investors', description: 'Learn the basics of investing together' },
    { name: 'Dividend Hunters', description: 'Focus on dividend growth strategies' },
    { name: 'Tech Stock Club', description: 'Discuss technology sector investments' },
  ];

  const insertGroup = db.prepare('INSERT INTO groups (name, description) VALUES (?, ?)');
  groups.forEach(g => insertGroup.run(g.name, g.description));

  console.log('Database seeded successfully!');
}

seedDatabase();
