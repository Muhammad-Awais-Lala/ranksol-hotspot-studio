
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Hotspot } from "../../types";
import { API_KEY, MODELS } from "../../constants";

/**
 * Compresses an image string or file to ensure it's below a size threshold
 */
async function compressImage(dataUrl: string, maxWidth = 1280, quality = 0.9): Promise<string> {
  let urlToLoad = dataUrl;
  if (import.meta.env.DEV && urlToLoad.startsWith('https://aistudio.ranksol.net/storage')) {
    urlToLoad = urlToLoad.replace('https://aistudio.ranksol.net', '');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image for compression"));
    img.src = urlToLoad;
  });
}

async function fileToPart(file: File | string) {
  let base64Data: string;
  let mimeType: string;

  if (typeof file === 'string') {
    const compressed = await compressImage(file);
    const splitData = compressed.split(';base64,');
    mimeType = splitData[0].split(':')[1];
    base64Data = splitData[1];
  } else {
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    const compressed = await compressImage(dataUrl);
    const splitData = compressed.split(';base64,');
    mimeType = splitData[0].split(':')[1];
    base64Data = splitData[1];
  }

  return {
    inlineData: {
      data: base64Data,
      mimeType: mimeType
    }
  };
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const callWithRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const errorMsg = err.message?.toLowerCase() || '';
      const isRetryable =
        errorMsg.includes('503') ||
        errorMsg.includes('429') ||
        errorMsg.includes('busy') ||
        errorMsg.includes('deadline');

      if (!isRetryable) throw err;

      console.warn(`Gemini API busy (attempt ${i + 1}/${retries}). Retrying in ${Math.pow(2, i)}s...`);
      await sleep(Math.pow(2, i) * 1000);
    }
  }
  throw lastError;
};



export const editImageMaterial = async (
  originalImage: File | string,
  element: string,
  materialName: string,
  materialImage?: string,
  coords?: { x: number; y: number },
  description?: string
): Promise<string> => {



  if (!API_KEY) {
    throw new Error("Gemini API key not configured. Please check your .env.local file and RESTART the dev server.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const parts: any[] = [];

  // Add original image
  const imagePart = await fileToPart(originalImage);
  parts.push(imagePart);
  console.log("room image imagePart===>", parts)

  // Add material texture image if provided
  if (materialImage) {
    const materialPart = await fileToPart(materialImage);
    parts.push(materialPart);
  }

  let coordinateNote = '';
  if (coords) {
    coordinateNote = `The target object is located at coordinates x=${coords.x}, y=${coords.y} (on a scale of 0 to 1000, where 0,0 is top-left).`;
  }

  let descriptionNote = '';
  if (description) {
    descriptionNote = `Additional Context for '${element}': ${description}. Use this to understand the material and texture better.`;
  }

  let materialInstruction = materialImage
    ? `Apply the exact texture, pattern, and material properties from the SECOND image provided (the texture sheet) to the '${element}' in the FIRST image.`
    : `Repaint the '${element}' with a high-end '${materialName}' finish.`;

  const prompt = `Task: Professional Photorealistic Interior Design Rendering.
  Action: Transform the '${element}' by applying the '${materialName}' material.
  
  Instructions:
  ${materialInstruction}
  
  Context:
  - Target Object: ${element}
  - Material Name: ${materialName}

  ${descriptionNote}
  
  Strict Visual Compliance Guidelines:
  1. CONTEXTUAL ACCURACY: Use the "Additional Context" provided to precisely identify the specific object. The new material must be applied to this exact entity.
  2. PHOTOREALISM: The result must be indistinguishable from a professional architectural photograph.
  3. TEXTURE & SEAMLESSNESS: ${materialImage ? `The texture from the provided sheet must be applied seamlessly over the '${element}', respecting its 3D form and curvature.` : `Maintain the underlying texture of the '${element}' while applying the new '${materialName}' finish.`}
  4. LIGHTING & PHYSICS: The new material must scientifically respond to the room's global illumination. Include accurate specular highlights, ambient occlusion, and bounced light reflections.
  5. SCENE INTEGRITY: All non-targeted elements in the photo must remain 100% identical to the original image.`;

  parts.push({ text: prompt });

  console.log("prompt===>", prompt)
  return await callWithRetry(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODELS.EDITING,
      contents: { parts: parts },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("Render failed: No content returned.");
    }

    const imagePartFound = response.candidates[0].content.parts.find(p => p.inlineData);
    if (imagePartFound?.inlineData) {
      return `data:${imagePartFound.inlineData.mimeType};base64,${imagePartFound.inlineData.data}`;
    }

    throw new Error("Image data missing from AI response.");
  });
};
