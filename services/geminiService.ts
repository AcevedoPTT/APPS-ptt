
import { GoogleGenAI, Type } from "@google/genai";
import type { IdeasResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ideaSchema = {
  type: Type.OBJECT,
  properties: {
    titulo: { type: Type.STRING, description: "Un título llamativo para la publicación." },
    texto: { type: Type.STRING, description: "Un texto breve para el cuerpo del post." },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Un array de 5 hashtags relevantes."
    },
    visual: { type: Type.STRING, description: "Una sugerencia visual para el diseño del post." },
  },
  required: ['titulo', 'texto', 'hashtags', 'visual']
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    idea_1: ideaSchema,
    idea_2: ideaSchema,
    idea_3: ideaSchema,
  },
  required: ['idea_1', 'idea_2', 'idea_3']
};


export const generateContentIdeas = async (rubro: string, objetivo: string, videoLink?: string): Promise<IdeasResponse> => {
  
  const baseInstructions = `
    - Un título gancho que atrape la atención en los primeros 3 segundos.
    - Un texto breve y persuasivo para la descripción del Reel.
    - 5 hashtags relevantes como un array de strings, mezclando populares y de nicho.
    - Una sugerencia visual y de producción para el video. Describe la estructura del video (ej: qué mostrar en los primeros segundos, desarrollo, llamado a la acción), sugiere audios en tendencia si es posible, y menciona herramientas online que podrían facilitar su creación (ej: CapCut, InShot, Canva).
  `;

  let prompt;

  if (videoLink) {
    prompt = `
      Actúa como un asesor de contenido experto para emprendedores en Instagram, especializado en la creación de Reels y videos cortos. El usuario te indicará el rubro de su emprendimiento, su objetivo de comunicación y un video de referencia para inspirarse.

      Tu tarea es:
      1. Analiza el video de referencia proporcionado para entender su estilo, formato, ritmo y tema.
      2. Usando ese video como inspiración principal, genera 3 NUEVAS y ORIGINALES ideas de videos (Reels). Las ideas deben capturar la esencia del video de referencia pero estar adaptadas específicamente al rubro y objetivo del usuario. No copies directamente el video de referencia.
      3. Para cada idea, detalla:
      ${baseInstructions}

      Rubro del emprendimiento: ${rubro}
      Objetivo de comunicación: ${objetivo}
      Video de referencia (inspiración): ${videoLink}

      Responde exclusivamente en formato JSON.
    `;
  } else {
    prompt = `
      Actúa como un asesor de contenido experto para emprendedores en Instagram, especializado en la creación de Reels y videos cortos. El usuario te indicará el rubro de su emprendimiento y su objetivo de comunicación.

      Tu tarea es:
      1. Generar 3 ideas de videos (Reels) para Instagram.
      2. Para cada idea, detalla:
      ${baseInstructions}

      Rubro del emprendimiento: ${rubro}
      Objetivo de comunicación: ${objetivo}

      Responde exclusivamente en formato JSON.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as IdeasResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Error al generar ideas: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al generar las ideas.");
  }
};
