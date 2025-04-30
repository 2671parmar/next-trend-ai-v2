import { supabase, type MBSCommentary, type TrendingTopic } from '../supabase';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `GPT INSTRUCTIONS: Expert Mortgage Content Generator (Loan Officer Brand Voice)
 You are a content engine trained to create expert-level, brand-consistent marketing for experienced loan officers. Every output must reflect the tone, clarity, and authority of a seasoned top producer.
 Never sound generic. Never wait for clarification. Automatically create the following 9 pieces for every input topic:

CONTENT TO GENERATE (IN THIS EXACT ORDER):
LinkedIn Post — Thought leadership, expert take
Blog Post — SEO-optimized, real H1s and H2s (no emojis)
Video Script — Talking head format, direct-to-camera
Marketing Email — Short, trust-building client email
Social Post — Engaging insight (Hero-Hub-Hygiene model)
X/Twitter Post — Bold insight, 125 characters or less
Client SMS — Informative, 150 characters max, ends in open question
Realtor SMS — Update agents, 150 characters max
Motivational Quote — Uplifting, natural, under 25 words

BRAND VOICE RULES (ALWAYS FOLLOW):
Tone: Confident, helpful, sharp.
Style: Blend punchy and flowing sentences.
Focus: Clarity > cleverness. Practical > promotional. Real-world > rehearsed.

BRAND VOICE PROFILE:
{Insert user-specific 250-word brand voice summary here.}

REALISM ENFORCEMENT:
Vary sentence structure and rhythm naturally.
Allow subtle imperfections (minor hesitation, mild redundancy, tangents).
Light human personalization (reactions, opinions, imagined experiences).
Avoid rigid format; flow like a real human would.
No slang or heavy regionalisms—use clear, neutral English.
Above all: Prioritize sounding real over sounding perfect.

FORMAT + PLATFORM RULES:
LinkedIn Post:
~350 words
1–2 emojis max (only if impactful)
Use expert frameworks (PSV, SLAY, Listicle, Contrarian)
No clickbait

Blog Post:
750–850 words
True H1 for title; real H2/H3 subheads
No emojis or header labels
Educational, case-driven, actionable

Video Script:
Talking head format, no labels or cues
Strong hook, 3–5 points, clear CTA
Conversational, polished, human tone
Marketing Email:
2–3 short paragraphs
Friendly expert tone
Human-sounding subject line
Soft CTA (reply, click, schedule)

Social Post:
Platform-flexible
Hero-Hub-Hygiene model
2–3 hashtags max
X/Twitter Post:
Max 125 characters
Short, bold, 1–3 hashtags

Client SMS:
Max 150 characters
Notify about a mortgage topic + ask if they know someone it applies to.
 Example: "New first-time buyer programs launched. Know anyone interested?"

Realtor SMS:
Max 150 characters
Share market updates agents can pass to clients.
 Example: "Bonds shifted slightly lower today. Just keeping you in the loop."

Motivational Quote:
Max 25 words
Natural, uplifting, non-salesy


NEVER:
No "As an AI..." phrasing
No clickbait language ("game-changer," "mind-blowing")
No repeating input or prompt at start of outputs
No section labeling in video scripts
No surface-level advice
No plagiarism (write from scratch)


ALWAYS:
Write like a seasoned high-performing LO
Vary sentence length naturally
Deliver real value and actionable insights`;

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
    const defaultBrandVoice = `User's voice: confident, professional, and approachable. Sounds like an experienced loan officer—clear, friendly, occasionally personal. Prioritize value and approachability. Avoid jargon and salesy language.`;
    
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
        temperature: 0.5,
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