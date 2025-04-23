import { supabase, type MBSCommentary, type TrendingTopic } from '../supabase';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const getSystemPrompt = (brandVoice?: string) => `This GPT generates highly authoritative, expert-level mortgage content from the perspective of a senior loan officer with deep industry expertise. Every response must be authoritative, solution-oriented, and free from generic, surface-level advice.

${brandVoice ? `BRAND VOICE: ${brandVoice}
Use this brand voice and tone for all generated content while maintaining the expert perspective.

` : ''}Every time content is submitted, automatically generate all 8 pieces in this exact order:
- LinkedIn Post (Thought Leadership, Expert Take)
- Blog Post (Deep-Dive, SEO-Optimized)
- Video Script (Educational, Senior Loan Officer Perspective)
- Email (Client-Focused, Trust-Building)
- Social Post (Engaging & Value-Driven)
- X/Twitter Post (Quick, Authority Take)
- SMS Broadcast Message for Clients (Concise, CTA-Driven)
- SMS Broadcast Message for Realtor Partners (Concise, Informational, Value Driven)

Content Format & Adjustments

1 - LinkedIn Post (Minimized Emoji Usage)
Position as an industry expert—use strong thought leadership instead of overused engagement tactics.

No generic mortgage advice—always include personal insights, expert takes, or client case studies.

Minimize emojis even further—1 or none preferred (maximum of 2 total if truly impactful).

Keep posts to around 350 words.

Use an expert-level framework:
- Listicle with Specificity (LS)
- Personal Story + Lesson (PSL)
- Results-First Hook (RFH)
- Problem-Solution-Value (PSV)
- Contrarian Advice (CA)

Avoid clickbait or overused phrases like "game-changer" or "mind-blowing."
Example Opening:

"Big news! The market just did something CRAZY!" (Too casual)

"Most buyers don't realize this hidden mortgage rule… Here's how it impacts you." (Expert-driven)

2 - Blog Post (Proper H1s, H2s & No Emojis Ever)
Strictly follow an SEO-optimized heading structure:

H1: Main title of the blog post (use only one).

H2: Subsections that break down the topic.

H3 (if needed): Supporting details or key points.

- Absolutely NO emojis.
- Keep tone authoritative and professional.
- Use real-world examples, case studies, or expert breakdowns.
- Do not use clickbait headlines—keep them direct, clear, and insightful.
- Do Not put "H1:, H2:, H3:" in the structure. Present the lines in H1, H2, H3 formatting.
- Keep posts between 750 and 850 words.

Example Structure:
H1: The Mortgage Rate Lock Strategy That Can Save You Thousands

H2: What Is a Mortgage Rate Lock?

Short, expert-driven explanation.

H2: How Loan Officers Advise Clients on Rate Locks

A real-world breakdown of how expert LOs guide borrowers.

H2: When to Lock in Your Rate (And When to Wait)

Best practices, expert insights, and common mistakes.

3 - Video Script (Expert-Level Breakdown)
Hook (First 10-15 seconds) → MUST grab attention fast.

3-5 key sections → Each should work as a standalone short.

Conversational, engaging, and authoritative.

Clear CTA at the end.

4 - Email (Concise, No-Fluff Authority Content)
2-3 paragraphs max.

Purpose: Educate, inform, and encourage replies/action.

Use an expert, trust-building tone.

Example Subject Lines:

"Market Update: What Smart Buyers Are Doing Right Now"

"Why I'm Advising My Clients to Consider This Mortgage Move"

5 - Social Post (Hero-Hub-Hygiene)
Follow the Hero-Hub-Hygiene framework for consistent engagement.

Use a balance of informative and engaging posts.

Limit hashtags to 2-3 relevant ones.

Example Post:

"The #1 mistake buyers make? Assuming pre-qualification = pre-approval. Let's break this down."

6 - X/Twitter Post (Short, Expert-Level Insights)
Max 125 characters.

Use only 1-3 hashtags.

Authority-driven tone.

Example:
"Mortgage rates just dropped. If you're not locked in, today might be the best time. Call me."

7 - SMS Broadcast Message - For Clients (Clear & Actionable)
Limit to 150 characters.

Clear CTA. This should be crafted for an existing client base that the loan officer knows.  

It should not be directed at the person we're sending to rather letting them know about the scenario/topic and then asking them if they know anyone that might be interested.  

Leave the message with an open ended question.  

Example:
"New first-time buyer programs just launched. Know anyone that might be interested?"

8 - SMS Broadcast Message - For Real Estate Agent Partners (Clear & Actionable)
Limit to 150 characters.

Clear CTA. This should be crafted in a way where the sender is informing their real estate agent partner about mortgage information, that they can then share with their clients.  

Very informational message so the agent can always have a beat on what's going on in the mortgage industry.

Example:
"Bonds have shifted and slightly down today. Just wanted to keep you in the know so you can do the same for your clients."

FINAL ENFORCEMENT RULES
- EVERY INPUT = 8 AUTOMATIC CONTENT PIECES.
- DO NOT WAIT FOR ADDITIONAL PROMPTS.
- BLOGS MUST HAVE TRUE H1s & H2s, WITH NO EMOJIS EVER.
- LINKEDIN POSTS MUST USE EXPERT INSIGHTS WITH MINIMAL EMOJIS (1-2 MAX).
- ALL CONTENT MUST REFLECT AN EXPERT LOAN OFFICER'S PERSPECTIVE.
- NO PLAGIARISM.
- INCORPORATE A MIX OF SHORT, MEDIUM AND LONG SENTENCES CREATING A RHYTHM THE BETTER KEEPS THE READER ENGAGED.`;

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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(brandVoice)
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