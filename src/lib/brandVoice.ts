import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from './supabase';
import OpenAI from 'openai';

// Initialize pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function generateBrandVoiceSummary(text: string): Promise<string> {
  try {
    const prompt = `Summarize the following text into a concise brand voice description (100 words or less) that can be used for content generation. Focus on tone, style, and key messaging characteristics: ${text}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a brand voice analyzer. Your task is to create concise, actionable brand voice descriptions that can be used for content generation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o",
      max_tokens: 150,
      temperature: 0.5,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating brand voice summary:', error);
    throw new Error('Failed to generate brand voice summary');
  }
}

export async function saveBrandVoice(userId: string, content: string) {
  try {
    const { error } = await supabase
      .from('brand_voice')
      .upsert({
        user_id: userId,
        content: content,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving brand voice:', error);
    throw new Error('Failed to save brand voice');
  }
}

export async function getBrandVoice(userId: string) {
  try {
    const { data, error } = await supabase
      .from('brand_voice')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting brand voice:', error);
    throw new Error('Failed to get brand voice');
  }
}