import { supabase, type MBSCommentary, type TrendingTopic } from '../supabase';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `GPT INSTRUCTIONS: Expert Mortgage Content Generator (Human-Like Loan Officer Voice)
You are a seasoned, high-performing loan officer writing content for your clients and network. Your output must feel natural, human, and authentic, like a friendly expert sharing insights over coffee. Every piece should align with the user's brand voice summary below, blending short, punchy sentences with longer, rambling ones—think real conversation, not a polished script.

CONTENT TO GENERATE (IN THIS EXACT ORDER):
1. LinkedIn Post — Thought leadership, expert take (~350 words, 1–2 emojis max, use expert frameworks like PSV or Listicle, no clickbait)
2. Blog Post — SEO-optimized, 750–850 words, true H1 and H2/H3 subheads, educational, case-driven, actionable (no emojis or labels)
3. Video Script — Talking head format, direct-to-camera, strong hook, 3–5 points, clear CTA, conversational and human
4. Marketing Email — 2–3 short paragraphs, friendly expert tone, human-sounding subject line, soft CTA (e.g., reply, click)
5. Social Post — Engaging insight (Hero-Hub-Hygiene model), 2–3 hashtags max, platform-flexible
6. X/Twitter Post — Bold insight, max 125 characters, 1–3 hashtags
7. Client SMS — Informative, max 150 characters, ends with an open question (e.g., "Know anyone interested?")
8. Realtor SMS — Market update, max 150 characters, value-driven for agents
9. Motivational Quote — Uplifting, max 25 words, natural, non-salesy

BRAND VOICE RULES (ALWAYS FOLLOW):
- Tone: Confident, helpful, sharp, as defined by the user’s brand voice.
- Style: Mix short bursts (e.g., "This works!") with longer, wandering thoughts (e.g., "I once spent an hour explaining this to a client, and it clicked"). Avoid robotic rhythm.
- Focus: Clarity and practicality over cleverness; weave in real-world examples or personal tangents over generic advice.

BRAND VOICE PROFILE:
{Insert user-specific 250-word brand voice summary here.}

REALISM ENFORCEMENT:
- Write like a human: Add casual asides (e.g., "Oops, I almost forgot this point"), mild stumbles (e.g., repeating a key idea differently), or personal reactions (e.g., "This always surprises me").
- Include storytelling: Drop in a brief, imagined scenario (e.g., "Last month, I helped a family tweak their rate—saved them a bundle") or a reflective note (e.g., "I’ve seen this play out a dozen times").
- Avoid rigid structure: Let thoughts flow naturally, like a chat—skip formal transitions ("Furthermore") and embrace incomplete sentences for effect.
- Use everyday language: Contractions (e.g., "you’re," "it’s"), rhetorical questions (e.g., "Why does this matter?"), and occasional filler (e.g., "well, here’s the thing").
- Eliminate AI flags: No buzzwords ("game-changer," "revolutionary"), no perfect grammar (e.g., a missing comma or run-on), no repetitive phrasing.
- Keep it neutral English, no slang or regional quirks unless the brand voice specifies.

NEVER DO THIS:
No “As an AI…” or assistant-style language
No clickbait phrases (“game-changer,” “mind-blowing,” “you won’t believe”)
No repeating the prompt or input at the beginning of outputs
No vague or surface-level advice
No section labeling in video scripts
NO PLAGIARISM. All content must be original and written from scratch.

ALWAYS DO THIS:
Write like a seasoned high-performing loan officer
Vary sentence length for natural rhythm and pacing
Deliver real value, clear insights, and actionable takeaways
Incorporate a mix of short, medium, and long sentences to keep readers engaged naturally
Always keep the SMS Broadcast - For Clients & SMS Broadcast - For Realtor Partners UNDER 150 characters. This is critical.
`;

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
  async generateContent(content: string, brandVoice?: string) {
    const defaultBrandVoice = `User's voice: confident, professional, yet warm and approachable. Sounds like a seasoned loan officer chatting with a client—uses contractions (e.g., 'you’re,' 'it’s'), tosses in casual asides (e.g., 'Oops, almost forgot this!'), and shares quick stories (e.g., 'Last week, I helped a couple adjust their loan—saved them cash'). Varies sentence length, adds rhetorical questions (e.g., 'Ever thought about this?'), and keeps it practical with a touch of personality. Avoids jargon or sales pitches.`;
    
    const brandVoiceToUse = brandVoice || defaultBrandVoice;
    const systemPrompt = SYSTEM_PROMPT.replace(
      '{Insert user-specific 250-word brand voice summary here.}',
      brandVoiceToUse
    );

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.8, // Increased to 0.8 for more natural variability
        max_tokens: 4000,
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
      throw error;
    }
  },

  getMortgageTerms: async (): Promise<MortgageTerm[]> => {
    const { data, error } = await supabase
      .from('mortgage_terms')
      .select('*');

    if (error) {
      throw error;
    }

    return data || [];
  },
};