import { GoogleGenAI, Type } from "@google/genai";
import type { IdeasResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ideaSchema = {
  type: Type.OBJECT,
  properties: {
    titulo: { type: Type.STRING, description: "Un título llamativo para la publicación." },
    guion: {
        type: Type.OBJECT,
        properties: {
            gancho: { 
                type: Type.OBJECT,
                properties: {
                    texto: { type: Type.STRING, description: "El texto del gancho para los primeros 3 segundos del video. Debe ser corto, potente, basado en tendencias virales de TikTok e Instagram, e idealmente con humor." },
                    busqueda_imagen_referencia: { type: Type.STRING, description: "Una consulta de búsqueda de imágenes concisa (3-5 palabras) para Google Images que represente visualmente la idea del gancho. Ejemplo: 'persona sorprendida mirando un placard'." }
                },
                required: ['texto', 'busqueda_imagen_referencia']
            },
            desarrollo: { type: Type.STRING, description: "El desarrollo del contenido del video, una explicación entretenida y de valor." },
            cta: { type: Type.STRING, description: "Un llamado a la acción (Call To Action) claro y efectivo para el final del video." },
        },
        required: ['gancho', 'desarrollo', 'cta']
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Un array de 5 hashtags relevantes."
    },
    sugerencia_visual: { type: Type.STRING, description: "Una sugerencia visual y de producción para el video, explicando qué mostrar en cada parte del guion." },
  },
  required: ['titulo', 'guion', 'hashtags', 'sugerencia_visual']
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


export const generateContentIdeas = async (rubro: string, objetivo: string, tematica: string, ideaUsuario: string, videoLink?: string): Promise<IdeasResponse> => {
  
  const baseInstructions = `
    - Un título gancho que sea irresistible y genere curiosidad inmediata.
    - Un guion detallado para el Reel, diseñado para "atrapar" a la audiencia y maximizar la retención, dividido en:
        1. Gancho (Hook) para Vender: ¡Esto es lo más importante! El gancho de los primeros 3 segundos debe ser una **frase ultra impactante y directa al grano, optimizada para anuncios (ads) y para vender**. Olvida los rodeos. Tu misión es detener el scroll de inmediato, filtrar al público ideal y despertar un deseo de compra irrefrenable. Basa tus ideas en las **tendencias virales más recientes (últimas semanas) de TikTok e Instagram**. Piensa en formatos como: "Deja de hacer [error común] si quieres [resultado deseado]", "3 señales de que necesitas [tu producto/solución]", "El hack de [Nicho] que me hubiera gustado saber antes", "POV: tu vida cambia después de descubrir [solución]", o audios en tendencia con texto superpuesto que presenta un problema y la solución. La frase debe ser controversial, curiosa o prometer una solución rápida a un problema doloroso. Además, proporciona una consulta de búsqueda de imágenes concisa (3-5 palabras) para Google Images que ilustre visualmente el gancho (ej: 'persona frustrada con computadora').
        2. Desarrollo: Contenido de alto valor, explicado de forma dinámica y entretenida. Mantén la energía alta.
        3. Llamado a la acción (CTA): Una instrucción final que sea imposible de ignorar y que fomente la interacción (ej: "comenta la palabra secreta", "guarda esto para no olvidarlo", "el link de mi bio resuelve este problema").
    - 5 hashtags relevantes como un array de strings, combinando hashtags de gran alcance con otros más específicos del nicho.
    - Una sugerencia visual y de producción detallada. Describe qué se debería ver en pantalla durante el gancho, el desarrollo y el CTA. Sugiere audios en tendencia si es posible, y menciona herramientas online que podrían facilitar su creación (ej: CapCut, InShot, Canva).
  `;

  const tematicaPrompt = tematica ? `La temática principal deseada para el reel es: **${tematica}**. Asegúrate de que el tono, el guion y las sugerencias se alineen perfectamente con esta temática.` : '';
  const ideaUsuarioPrompt = ideaUsuario ? `El usuario tiene una idea inicial que quiere desarrollar: **"${ideaUsuario}"**. Usa esta idea como base principal para generar las 3 propuestas, expandiéndola, mejorándola y dándole un formato de Reel viral.` : 'El usuario no ha proporcionado una idea inicial, así que tienes libertad creativa total para proponer conceptos desde cero.';


  let prompt;
  // El prompt ahora prioriza la idea del usuario.
  if (videoLink) {
    prompt = `
      Actúa como un asesor de contenido experto para emprendedores en Instagram, especializado en la creación de Reels y videos cortos virales que "atrapen" a la audiencia.
      El usuario te indicará su rubro, objetivo, temática, una idea inicial (opcional) y un video de referencia para inspirarse.

      Tu tarea es:
      1. ${ideaUsuarioPrompt}
      2. Analiza el video de referencia para entender su estilo, formato, ritmo y tema.
      3. Usando la idea del usuario y el video de referencia como inspiración, genera 3 NUEVAS y ORIGINALES ideas de videos (Reels). Las ideas deben capturar la esencia de la inspiración pero estar adaptadas al rubro, objetivo y temática del usuario.
      4. ${tematicaPrompt}
      5. Para cada idea, detalla:
      ${baseInstructions}

      Rubro del emprendimiento: ${rubro}
      Objetivo de comunicación: ${objetivo}
      Video de referencia (inspiración): ${videoLink}

      Responde exclusivamente en formato JSON.
    `;
  } else {
    prompt = `
      Actúa como un asesor de contenido experto para emprendedores en Instagram, especializado en la creación de Reels y videos cortos virales que "atrapen" a la audiencia.
      El usuario te indicará el rubro de su emprendimiento, su objetivo de comunicación, la temática deseada y una idea inicial (opcional).

      Tu tarea es:
      1. ${ideaUsuarioPrompt}
      2. Generar 3 ideas de videos (Reels) para Instagram.
      3. ${tematicaPrompt}
      4. Para cada idea, detalla:
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