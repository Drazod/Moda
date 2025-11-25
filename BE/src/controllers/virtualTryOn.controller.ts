import { Request, Response } from 'express';
import axios from 'axios';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_CLOUD_API_KEY!,
});

const GEMINI_MODEL = 'gemini-3-pro-image-preview';

const generationConfig = {
  maxOutputTokens: 32768,
  temperature: 1,
  topP: 0.95,
  responseModalities: ['IMAGE'],
  imageConfig: {
    aspectRatio: '1:1',
    imageSize: '1K',
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'OFF',
    },
  ],
} as const;

export const virtualTryOn = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      humanImage?: Express.Multer.File[];
    };

    const humanFile = files?.humanImage?.[0];
    const { clothImageUrl } = req.body as { clothImageUrl?: string };

    if (!humanFile) {
      return res.status(400).json({ error: 'humanImage file is required' });
    }
    if (!clothImageUrl) {
      return res.status(400).json({ error: 'clothImageUrl is required' });
    }

    const prompt =
'You are a professional virtual try-on system.'+

'Use the FIRST image as the person.'+
'Use the SECOND image as the clothing reference.'+

'Replace ONLY the visible clothing on the person in the first image with clothing that matches the design in the second image:'+
'- match the color, pattern, fabric type, and general shape of the clothing in the second image'+
'- adapt the garment to the person’s body, pose, and perspective'+
'- add realistic folds, wrinkles, shading, and contact with the body'+

'Keep these elements from the first image unchanged:'
'- the person’s face, hairstyle, skin tone, and body shape'+
'- the pose, camera angle, lighting, and shadows'+
'- the background and surroundings'+

'The final result should look like a real photo of the same person wearing the clothing from the second image.'+
'Do not add any extra logos, text, or new accessories that are not already implied by the clothing design. '
;

    // Download cloth image from Firebase
    const clothResponse = await axios.get<ArrayBuffer>(clothImageUrl, {
      responseType: 'arraybuffer',
    });
    const clothBuffer = Buffer.from(clothResponse.data);
    const clothContentType =
      (clothResponse.headers['content-type'] as string | undefined) || 'image/jpeg';

    // Sanity check: only allow supported mimetypes
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(humanFile.mimetype)) {
      return res.status(400).json({
        error: `Unsupported humanImage mimetype: ${humanFile.mimetype}. Allowed: ${allowedTypes.join(
          ', ',
        )}`,
      });
    }
    if (!allowedTypes.includes(clothContentType)) {
      return res.status(400).json({
        error: `Unsupported clothImage mimetype: ${clothContentType}. Allowed: ${allowedTypes.join(
          ', ',
        )}`,
      });
    }
    const resizedHuman = await sharp(humanFile.buffer)
      .resize(1024) // max width/height
      .jpeg({ quality: 90 })
      .toBuffer();

    const resizedCloth = await sharp(clothBuffer)
      .resize(1024)
      .jpeg({ quality: 90 })
      .toBuffer();
    // Call Gemini 3 Pro Image with both images + prompt
    const streamingResp = await genAI.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { data: resizedHuman.toString('base64'), mimeType: 'image/jpeg' } },
            { inlineData: { data: resizedCloth.toString('base64'), mimeType: 'image/jpeg' } },
          ],
        },
      ],
      config: generationConfig,
    } as any);

    let imageBase64: string | null = null;
    outer: for await (const chunk of streamingResp as any) {
      const candidates = chunk.candidates ?? [];
      for (const cand of candidates) {
        const parts = cand.content?.parts ?? [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            imageBase64 = part.inlineData.data;
            break outer; // stop streaming
          }
        }
      }
    }

    if (!imageBase64) {
      return res.status(500).json({ error: 'No image returned from Gemini' });
    }

    return res.status(200).json({
      message: 'Virtual try-on completed (Gemini)',
      imageBase64,
    });
  } catch (error: any) {
    console.error('❌ Virtual try-on edit error:', error.response?.data || error);
    return res.status(500).json({
      error: 'Failed to process virtual try-on with image edits',
      details: error.message ?? String(error),
    });
  }
};
