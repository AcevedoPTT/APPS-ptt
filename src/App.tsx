import React, { useState, useCallback, useEffect } from 'react';
import { generateContentIdeas } from './services/geminiService';
import type { IdeasResponse, PostIdea } from './types';
import IdeaCard from './components/IdeaCard';
import { SparklesIcon, LinkIcon } from './components/icons';

const App: React.FC = () => {
  const [rubro, setRubro] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [tematica, setTematica] = useState('');
  const [ideaUsuario, setIdeaUsuario] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [ideas, setIdeas] = useState<PostIdea[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ [key: string]: string[] }>({
    rubro: [],
    objetivo: [],
    tematica: [],
  });

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('reel-idea-history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  const updateHistory = useCallback((field: string, value: string) => {
    if (!value || typeof value !== 'string' || value.trim() === '') return;
    setHistory(prevHistory => {
      const currentHistory = prevHistory[field] || [];
      const newFieldHistory = [value, ...currentHistory.filter(item => item !== value)].slice(0, 10);
      const updatedHistory = { ...prevHistory, [field]: newFieldHistory };
      try {
        localStorage.setItem('reel-idea-history', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Failed to save history to localStorage", e);
      }
      return updatedHistory;
    });
  }, []);

  const handleGeneration = useCallback(async () => {
    if (!rubro || !objetivo) {
      setError('Por favor, completa los campos de rubro y objetivo.');
      return;
    }

    updateHistory('rubro', rubro);
    updateHistory('objetivo', objetivo);
    updateHistory('tematica', tematica);
    
    setIsLoading(true);
    setError(null);
    setIdeas(null);

    try {
      const response: IdeasResponse = await generateContentIdeas(rubro, objetivo, tematica, ideaUsuario, videoLink);
      setIdeas(Object.values(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, [rubro, objetivo, tematica, ideaUsuario, videoLink, updateHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGeneration();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow-sm dark:bg-gray-800/50 dark:border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Generador de Ideas de Reels para Instagram</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Potencia tus ideas para tu próximo Reel</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Describe tu negocio, tu meta y la temática que buscas. Si tienes una idea, ¡compártela! La IA la usará como inspiración.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div>
              <label htmlFor="ideaUsuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Desarrolla brevemente tu idea (Opcional)
              </label>
              <textarea
                id="ideaUsuario"
                value={ideaUsuario}
                onChange={(e) => setIdeaUsuario(e.target.value)}
                placeholder="Ej: Quiero hacer un video mostrando 3 errores comunes que cometen los principiantes en mi nicho."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                <label htmlFor="tematica" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Temática del Reel
                </label>
                <input
                  type="text"
                  id="tematica"
                  list="tematica-history"
                  value={tematica}
                  onChange={(e) => setTematica(e.target.value)}
                  placeholder="Ej: Humor, educativo, storytelling"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  disabled={isLoading}
                />
                <datalist id="tematica-history">
                  {(history.tematica || []).map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>
              <div>
                <label htmlFor="rubro" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rubro de tu emprendimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="rubro"
                  list="rubro-history"
                  value={rubro}
                  onChange={(e) => setRubro(e.target.value)}
                  placeholder="Ej: Tienda de ropa vintage"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  disabled={isLoading}
                  required
                />
                 <datalist id="rubro-history">
                  {(history.rubro || []).map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>
              <div>
                <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Objetivo de comunicación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="objetivo"
                  list="objetivo-history"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  placeholder="Ej: Atraer nuevos clientes"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  disabled={isLoading}
                  required
                />
                <datalist id="objetivo-history">
                  {(history.objetivo || []).map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>
            </div>
             <div>
              <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enlace de video para inspiración (Opcional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                   <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="videoLink"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="Pega un enlace de Instagram, TikTok o YouTube"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando...
                  </>
                ) : 'Generar Ideas'}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-8" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && !ideas && (
            <div className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">Creando contenido increíble para ti...</p>
            </div>
        )}

        {ideas && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">¡Aquí tienes tus ideas para Reels!</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {ideas.map((idea, index) => (
                <IdeaCard key={index} idea={idea} index={index} />
              ))}
            </div>
             {!isLoading && (
              <div className="text-center pt-8">
                <button
                  onClick={() => handleGeneration()}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-transform transform hover:scale-105 disabled:bg-purple-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                  <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
                  Mejorar Ideas
                </button>
              </div>
            )}
          </div>
        )}
        
        {!isLoading && !ideas && !error && (
          <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <SparklesIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Tus ideas de Reels aparecerán aquí</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Completa el formulario para recibir ideas de videos virales.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;