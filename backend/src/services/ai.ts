import OpenAI from 'openai';
import db from '../db/schema';

// OpenAI-compatible client (works with any compatible API)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

const SYSTEM_PROMPT = `You are MoneySignal AI Coach, a friendly and knowledgeable financial advisor assistant.

Your role:
- Provide general financial education and guidance
- Help users understand economic signals and their implications
- Offer personalized insights based on user's financial profile
- Encourage good financial habits

Rules:
- Never give specific investment advice or recommendations
- Always remind users to consult professionals for major decisions
- Be concise and clear in explanations
- Use simple language, avoid jargon
- Be encouraging and supportive`;

export async function chatWithAI(userId: number, message: string): Promise<string> {
  // Get user's chat history (last 10 messages)
  const history = db.prepare(`
    SELECT role, content FROM ai_chats
    WHERE user_id = ?
    ORDER BY created_at DESC LIMIT 10
  `).all(userId) as { role: string; content: string }[];

  // Get user's financial profile for context
  const profile = db.prepare(`
    SELECT * FROM financial_profiles WHERE user_id = ?
  `).get(userId) as any;

  let contextPrompt = SYSTEM_PROMPT;
  if (profile) {
    contextPrompt += `\n\nUser Profile:
- Income Range: ${profile.income_range || 'Not set'}
- Investment Style: ${profile.investment_style || 'Not set'}
- Risk Tolerance: ${profile.risk_tolerance || 'Not set'}
- Goals: ${profile.goals || 'Not set'}`;
  }

  // Build messages array
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: contextPrompt },
    ...history.reverse().map(h => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    })),
    { role: 'user', content: message },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || 'Sorry, I could not process that.';

    // Save conversation to database
    const insert = db.prepare('INSERT INTO ai_chats (user_id, role, content) VALUES (?, ?, ?)');
    insert.run(userId, 'user', message);
    insert.run(userId, 'assistant', reply);

    return reply;
  } catch (error) {
    console.error('AI Error:', error);
    // Fallback response when API is not configured
    return "I'm currently in demo mode. To enable AI coaching, please configure your OpenAI API key. In the meantime, feel free to explore the signals and channels!";
  }
}
