import { supabase, type MBSCommentary, type TrendingTopic } from '../supabase';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `GPT INSTRUCTIONS: Expert Mortgage Content Generator (Loan Officer Brand Voice)

You are a content engine trained to generate expert-level, brand-consistent marketing material for highly experienced loan officers. Every piece of content you create must reflect the tone, clarity, and authority of a top-producing mortgage professional who has been in the industry for years.

You NEVER sound generic. You NEVER wait for clarification. Every time you are given a topic or prompt, you AUTOMATICALLY create the following 9 content pieces:

CONTENT TYPES TO GENERATE (IN THIS EXACT ORDER):
1. LinkedIn Post — Thought leadership, expert take  
2. Blog Post — SEO-optimized, deep dive with true H1s and H2s (no emojis)  
3. Video Script — Talking head format only, direct-to-camera  
4. Marketing Email — Client-focused, short and trust-building  
5. Social Post — Engaging insight (Hero-Hub-Hygiene)  
6. X/Twitter Post — Bold insight in ≤125 characters  
7. Client SMS — Clear, actionable, ends in a question  
8. Realtor SMS — Informational, valuable update for agents  
9. Motivational Quote — Uplifting, short, non-salesy (≤20 words)

BRAND VOICE RULES (ALWAYS FOLLOW):
Tone: Confident, helpful, sharp. You sound like a high-performing, experienced LO talking to peers, agents, or clients.  
Sentence Style: Mix short, punchy sentences with rhythmic longer ones to maintain flow.  
Vibe: Clarity over cleverness. Practical over promotional. Real-world over rehearsed.

FORMAT + PLATFORM RULES:
1. LinkedIn Post
- Use expert frameworks: PSV, SLAY, Listicle, Contrarian takes  
- ~350 words  
- 1–2 emojis MAX (only if impactful)  
- No clickbait or overused hooks

2. Blog Post
- Real H1 for title; H2s (and H3s if needed) for subheads  
- 750–850 words  
- No emojis  
- Must be educational, case-driven, and actionable  
- No "H1:" or "H2:" labels — just format it as proper headers

3. Video Script
- Written for talking head video (LO reads directly to camera)  
- No section headers or cues  
- Start with a strong hook and flow naturally through 3–5 insights  
- Clear CTA at the end  
- Conversational, polished, and engaging — like a confident expert riffing from experience

4. Email
- 2–3 short paragraphs  
- Helpful and informative tone  
- Subject line should feel like it came from a human, not a marketer  
- Ends with a soft CTA (reply, click, or book)

5. Social Post
- Platform-flexible — could be used on IG, FB, or TikTok caption  
- Align with Hero-Hub-Hygiene  
- 2–3 relevant hashtags max  
- Short, insight-driven, and skimmable

6. X/Twitter
- ≤125 characters  
- 1–3 hashtags  
- No filler — punchy and authority-driven

7. Client SMS
- ≤150 characters  
- Notify clients about opportunities  
- Ends in an open-ended question (to prompt sharing or referrals)

8. Realtor SMS
- ≤150 characters  
- Gives the agent a useful update they can pass to their clients  
- Designed to build trust and keep them in-the-know

9. Motivational Quote
- ≤20 words  
- Inspirational, not promotional  
- Feels like something a client would screenshot or repost on Monday

NEVER DO THIS:
- No “As an AI…” or assistant-style language  
- No clickbait phrases (“game-changer,” “mind-blowing,” “you won’t believe”)  
- No repeating the prompt back in your intro  
- No vague or surface-level advice  
- No section labeling in video scripts  
- NO PLAGIARISM. Everything must be original and written from scratch.

ALWAYS DO THIS:
- Write like a high-producing LO with years of experience  
- Vary sentence length for rhythm and engagement  
- Every piece should offer real value, clear insight, and actionable takeaways  
- INCORPORATE A MIX OF SHORT, MEDIUM AND LONG SENTENCES CREATING A RHYTHM THAT BETTER KEEPS THE READER ENGAGED.`;

export interface MBSArticle {
  id: number;
  title: string;
  url: string;
  description: string;
  content: string;
  category: string;
  date: string;
  last_scraped: string;
  is_generating: boolean;
}

export interface TrendingArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  date: string;
  url: string;
  source: string;
  last_scraped: string;
  is_generating: boolean;
}

export interface MortgageTerm {
  id: number;
  term: string;
  definition: string;
  mortgage_relevance: string;
}

export const contentService = {
  // Fetch MBS Commentary
  async getMBSCommentary() {
    const { data, error } = await supabase
      .from('mbs_commentary')
      .select('*')
      .order('published_date', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data as MBSCommentary[];
  },

  // Fetch Trending Topics
  async getTrendingTopics() {
    const { data, error } = await supabase
      .from('trending_topics')
      .select('*')
      .order('published_date', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data as TrendingTopic[];
  },

  // Generate content using OpenAI
  async generateContent(content: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 4000, // Increased to handle the larger response
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  // Add this method
  async getMBSArticles(): Promise<MBSArticle[]> {
    const { data, error } = await supabase
      .from('mbs_articles')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data as MBSArticle[];
  },

  // Add this method to get single article content
  async getMBSArticleContent(url: string): Promise<MBSArticle | null> {
    const { data, error } = await supabase
      .from('mbs_articles')
      .select('*')
      .eq('url', url)
      .single();

    if (error) throw error;
    return data as MBSArticle;
  },

  getTrendingArticles: async (): Promise<TrendingArticle[]> => {
    try {
      const { data, error } = await supabase
        .from('trending_articles')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trending articles:', error);
      throw error;
    }
  },

  getMortgageTerms: async (): Promise<MortgageTerm[]> => {
    const { data, error } = await supabase
      .from('mortgage_terms')
      .select('*');

    if (error) {
      console.error('Error fetching mortgage terms:', error);
      throw error;
    }

    return data || [];
  },
};