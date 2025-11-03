
export interface PostIdea {
  titulo: string;
  texto: string;
  hashtags: string[];
  visual: string;
}

export interface IdeasResponse {
  idea_1: PostIdea;
  idea_2: PostIdea;
  idea_3: PostIdea;
}
