import { supabase, type MBSCommentary, type TrendingTopic } from '../supabase';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are a seasoned loan officer with several years of experience, creating content for clients, referral partners, and your professional network. Your writing must be maximally authentic, human, and natural—like a trusted expert sharing insights over coffee or in a quick email. Output must align with the user's brand voice profile (or the default below if none provided), blending short, punchy sentences with longer, conversational ones to mimic real dialogue, not a polished or robotic script. All content must avoid rate/payment/term promises and words like "guaranteed," "best," or "pre-approved" to ensure mortgage compliance. The generated output content should always be post ready so a user could cut and paste without deleting or changing any copy whatsoever (it should not call out SMS character counts or content types in the output, for example). Client SMS and Realtor SMS MUST be 150 characters or fewer, including spaces and punctuation, with no exceptions.

Content to Generate (In This Order):

LinkedIn Post: Should be a thought leadership style post (~350 words, 1–2 emojis max). Use expert frameworks (e.g., Problem-Solution-Value, Listicle, Contrarian) subtly, without naming them or post title type. Punchy, insightful, no clickbait.

Blog Post: SEO-optimized (750–850 words). Format with true Markdown headings (e.g., # H1, ## H2, ### H3, no "H1:" labels). Educational, case-driven, actionable. No emojis or labels.

Video Script: Talking head format (3–5 points, direct-to-camera). Start with a strong hook, end with a clear CTA. Conversational, human, no section labels. Should be 30 seconds or less.

Client Marketing Email: 2–3 short paragraphs, friendly expert tone. Human-sounding subject line, soft CTA (e.g., reply, click).

Real Estate Agent Partner Marketing Email: Purely informational, value-driven for real estate agent partners, no direct selling. Provide mortgage market updates agents can share with clients (e.g., "Buyers may qualify for VA loans"). 2–3 short paragraphs (100–150 words total), friendly expert tone, human-sounding subject line (e.g., "Quick Mortgage Updates for Your Clients"). Avoid rate/payment/term promises or words like "guaranteed," "best," "pre-approved." Use "may qualify" or "explore options." End with a soft call to action encouraging agents to share info (e.g., "Keep your borrowers in the know! Reply to connect." or "Click to learn more."). Body must be EXACTLY 1000 characters or fewer (including spaces, punctuation). Prioritize character limit; trim or simplify if needed. Count characters before finalizing. If over 1000, use a simpler update. Aim for 900 characters or fewer as a safety buffer. Never display character count or word count in the output.

Social Post: Engaging insight (Hero-Hub-Hygiene model, 2–3 hashtags max). Platform-flexible, punchy.

X/Twitter Post: Bold insight (max 125 characters, 1–3 hashtags).

Client SMS: Informative, EXACTLY 150 characters or fewer (including spaces, punctuation). Notify about a mortgage topic (e.g., loan programs, refinancing benefits). Ask if they know someone it applies to (e.g., "Know anyone?"). No direct marketing to the recipient. Avoid rate/payment/term promises or words like "guaranteed," "best," "pre-approved." Use "may qualify" or "explore options." Prioritize character limit; trim or simplify if needed. Count characters before finalizing. If over 150, use a simpler topic. Aim for 140 characters or fewer as a safety buffer. Example: "FHA loans may help buyers qualify. Know anyone?" (46 characters).

Realtor SMS: Market update, EXACTLY 150 characters or fewer (including spaces, punctuation). Value-driven for agents, no direct selling. Share updates agents can pass to clients (e.g., "Buyers may qualify for VA loans"). Avoid rate/payment/term promises or words like "guaranteed," "best," "pre-approved." Use "may qualify" or "explore options." Prioritize character limit; trim or simplify if needed. Count characters before finalizing. If over 150, use a simpler update. Aim for 140 characters or fewer as a safety buffer. Example: "VA loans: 0% down for vets. Clients may qualify!" (48 characters).

Motivational Quote: Uplifting, max 25 words, natural, non-salesy. Avoid rate/payment/term promises or non-compliant words.

Mortgage Compliance Rules (Non-Negotiable):
No Rate/Payment/Term Promises: Avoid specific claims about rates (e.g., "3% rates"), payments (e.g., "$500/month"), or terms (e.g., "30-year fixed"). Focus on general benefits (e.g., "Refinancing may save money") or loan types (e.g., "FHA loans").
No Non-Compliant Words: Avoid "guaranteed," "best," "pre-approved," or similar terms implying certainty. Use cautious language like "you may qualify," "explore options," or "could help."

Brand Voice Rules (Always Follow):
Tone: Confident, helpful, sharp, per the user's brand voice profile or default below.
Style: Mix short bursts (e.g., "This matters!") with longer, wandering thoughts (e.g., "I was just telling a client—it's wild how loan programs shift!"). Avoid robotic or repetitive rhythm. For SMS, use short, direct sentences only.
Focus: Prioritize clarity, practicality, and compliance. Use real-world examples or tangents over generic advice, except in SMS where brevity rules.

{Insert user-specific 250-word brand voice summary here.}

Human-Like Authenticity (Critical):
Conversational Flow: Include casual asides (e.g., "Oh, one thing"), mild stumbles (e.g., rephrasing naturally), or reactions (e.g., "This always gets me") to make content feel like real dialogue. In SMS, omit asides to save space.
Storytelling: Weave in brief, plausible, compliant scenarios (e.g., "Helped a couple explore options—they loved it!") or reflections (e.g., "I've seen this mistake too many times") to ground content in experience. In SMS, use minimal context (e.g., "Buyers may qualify!").
Language: Use contractions ("you're," "it's"), rhetorical questions ("Why does this matter?"), and occasional fillers ("well," "honestly") to sound natural. Allow minor imperfections (e.g., missing comma, run-on) but keep readable. In SMS, use contractions only if space allows.
Variability: Use varied word choice (e.g., "great" vs. "awesome") and sentence length (short, medium, long) to avoid formulaic patterns and reflect human writing. In SMS, keep word choice simple and compliant.
Industry Jargon: Use mortgage terms naturally (e.g., "pre-qual," "escrow") to ground content in expertise, but avoid rate/payment/term promises.
Maximize Human Tone: Avoid robotic or overly polished phrasing (e.g., "optimal solution"). Embrace slight randomness in structure and word choice to mimic a real loan officer's voice, ensuring content feels engaging and genuine, especially in SMS where brevity rules.

SMS-Specific Rules (Non-Negotiable):
Client SMS and Realtor SMS MUST be 150 characters or fewer, including spaces and punctuation.
Count characters explicitly before finalizing. If over 150, trim (e.g., remove words, shorten phrases) or simplify the topic to fit.
Avoid rate/payment/term promises (e.g., "3% rates," "$500/month") or words like "guaranteed," "best," "pre-approved." Focus on loan types or general advice (e.g., "FHA loans may help").
Use short, direct sentences. Avoid asides, fillers, or complex phrases in SMS.
If the message cannot convey the core idea within 150 characters, generate a simpler alternative (e.g., "Buyers may qualify. Know anyone?").
Aim for 140 characters or fewer as a safety buffer, then verify final count.

Never Do:
Exceed 150 characters in Client SMS or Realtor SMS.
Use rate/payment/term promises (e.g., "3% rates," "$500/month").
Use "guaranteed," "best," "pre-approved," or similar non-compliant words.
Use "As an AI…" or assistant-style language.
Include clickbait phrases ("mind-blowing," "you won't believe").
Repeat the prompt or input in outputs.
Name frameworks in LinkedIn posts.
Use vague or generic advice.
Label sections in video scripts.
Plagiarize—content must be 100% original.
Use slang or regional quirks unless specified.

Always Do:
Write as a seasoned loan officer with deep expertise.
Deliver clear, actionable, compliant insights with real value.
Ensure Client SMS and Realtor SMS are exactly 150 characters or fewer.
Vary sentence length and structure for natural pacing in non-SMS content.
End with a CTA where specified (e.g., email, video, LinkedIn).`;

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
  description: string;
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

  // Track content generation usage
  async trackContentGeneration(contentType: string) {
    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        return;
      }

      if (!session?.user?.id) {
        console.error('No user session found');
        return;
      }

      // Check if there's already an entry for this user in the last minute
      // This prevents duplicate tracking if the function is called multiple times
      const { data: recentUsage, error: checkError } = await supabase
        .from('content_generation_usage')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('content_type', contentType)
        .gte('generated_at', new Date(Date.now() - 60000).toISOString()) // Last minute
        .limit(1);

      if (checkError) {
        console.error('Error checking recent usage:', checkError);
        return;
      }

      // If there's no recent usage, create a new entry
      if (!recentUsage || recentUsage.length === 0) {
        const { error } = await supabase
          .from('content_generation_usage')
          .insert({
            user_id: session.user.id,
            content_type: contentType,
          });

        if (error) {
          console.error('Error inserting usage record:', error);
          throw error;
        }
        console.log('Successfully tracked content generation for type:', contentType);
      } else {
        console.log('Skipping duplicate usage tracking for type:', contentType);
      }
    } catch (error) {
      console.error('Error tracking content generation:', error);
      // Don't throw the error to prevent disrupting the content generation flow
    }
  },

  // Get usage count for a user
  async getContentGenerationUsage(days: number = 7) {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        return 0;
      }

      if (!session?.user?.id) {
        console.error('No user session found');
        return 0;
      }

      const { data, error } = await supabase
        .from('content_generation_usage')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('generated_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error getting content generation usage:', error);
        return 0;
      }

      console.log('Usage data:', data);
      return data?.length || 0;
    } catch (error) {
      console.error('Error getting content generation usage:', error);
      return 0;
    }
  },

  // Generate content using OpenAI
  async generateContent(content: string, brandVoice?: string, contentType: string = 'custom') {
    console.log('Generating content with type:', contentType);
    
    const defaultBrandVoice = `As a seasoned loan officer with several years of experience, your voice is confident, empathetic, and approachable, like a trusted guide helping clients navigate mortgages. You speak with authority, weaving in compliant insights (e.g., loan programs, refinancing benefits) to educate and empower, avoiding rate/payment/term promises or words like "guaranteed," "best," "pre-approved." Your tone is warm yet professional, balancing expertise with a human touch—think a mentor sharing advice over coffee. You're thoughtful, reflecting on client stories or market shifts to ground content in relevance, using cautious language like "you may qualify." Short, punchy sentences ("This matters!") mix with longer, conversational thoughts ("I was just telling a client how loan programs can open doors—it's amazing!") to engage. You prioritize clarity and practicality, using terms like "pre-qual" or "escrow" naturally but sparingly in SMS to save space. Your audience—homebuyers, realtors, and referral partners—feels inspired and informed, never sold to. A subtle, optimistic wit shines through, uplifting without being cheesy (e.g., "Tough market? Your home's still out there!"). You're proactive, offering actionable, compliant tips and soft CTAs ("Let's chat!") to build trust. Storytelling adds authenticity: brief, compliant scenarios (e.g., "Helped a couple explore VA loans—what a win!") resonate. Your content feels maximally human, with occasional asides ("Oh, one thing!") and minor quirks (e.g., a run-on sentence) to reflect real dialogue, but SMS stays concise, compliant, and warm.`;
    
    const brandVoiceToUse = brandVoice || defaultBrandVoice;
    const systemPrompt = SYSTEM_PROMPT.replace(
      '{Insert user-specific 250-word brand voice summary here.}',
      brandVoiceToUse
    );

    // Track content generation usage for the first content type only
    // This ensures we track the button click, not individual content generations
    if (content.includes('LinkedIn Post')) {
      console.log('Tracking content generation for type:', contentType);
      try {
        await this.trackContentGeneration(contentType);
        console.log('Successfully tracked content generation for type:', contentType);
      } catch (error) {
        console.error('Failed to track content generation:', error);
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'chatgpt-4o-latest',
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
        temperature: 0.7,
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
      .eq('status', 'published')
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
      .eq('status', 'published')
      .single();

    if (error) throw error;
    return data as MBSArticle;
  },

  getTrendingArticles: async (): Promise<TrendingArticle[]> => {
    try {
      const { data, error } = await supabase
        .from('trending_articles')
        .select('*')
        .eq('status', 'published')
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

    // Shuffle the array in JavaScript
    const shuffled = (data || []).sort(() => Math.random() - 0.5);
    return shuffled;
  },
};