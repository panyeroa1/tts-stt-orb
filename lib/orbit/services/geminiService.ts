'use client';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API Key is not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `Translate the following text to ${targetLanguage}. 
Output ONLY the translated text, no other commentary or formatting.

Text: "${text}"`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Gemini translation failed');
    }

    const data = await response.json();
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!translatedText) {
      throw new Error('Empty response from Gemini');
    }

    return translatedText;
  } catch (error) {
    console.error('[Gemini Service] Translation error:', error);
    throw error;
  }
}
