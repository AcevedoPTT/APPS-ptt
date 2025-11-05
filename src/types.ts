export interface PostIdea {
  titulo: string;
  guion: {
    gancho: {
      texto: string;
      busqueda_imagen_referencia: string;
    };
    desarrollo: string;
    cta: string;
  };
  hashtags: string[];
  sugerencia_visual: string;
}

export interface IdeasResponse {
  idea_1: PostIdea;
  idea_2: PostIdea;
  idea_3: PostIdea;
}