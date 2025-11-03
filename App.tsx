
import React, { useState, useCallback } from 'react';
import { generateContentIdeas } from './services/geminiService';
import type { IdeasResponse, PostIdea } from './types';
import IdeaCard from './components/IdeaCard';
import { SparklesIcon, LinkIcon } from './components/icons';

const App: React.FC = () => {
  const [rubro, setRubro] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [ideas, setIdeas] = useState<PostIdea[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rubro || !objetivo) {
      setError('Por favor, completa los campos de rubro y objetivo.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setIdeas(null);

    try {
      const response: IdeasResponse = await generateContentIdeas(rubro, objetivo, videoLink);
      setIdeas(Object.values(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, [rubro, objetivo, videoLink]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" />
          <h1 className="text-3xl font-bold text-gray-900">Generador de Ideas de Reels para Instagram</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Potencia tus ideas para tu próximo Reel</h2>
          <p className="text-gray-500 mb-6">
            Pega un enlace como inspiración, o simplemente describe tu negocio y tu meta. La IA creará 3 ideas de Reels listas para grabar.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700 mb-2">
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
                  placeholder="Ej: https://www.instagram.com/reel/..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="rubro" className="block text-sm font-medium text-gray-700 mb-2">
                  Rubro de tu emprendimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="rubro"
                  value={rubro}
                  onChange={(e) => setRubro(e.target.value)}
                  placeholder="Ej: Tienda de ropa vintage"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo de comunicación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="objetivo"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  placeholder="Ej: Atraer nuevos clientes"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  disabled={isLoading}
                  required
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
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              <p className="text-lg text-gray-600">Creando contenido increíble para ti...</p>
            </div>
        )}

        {ideas && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center text-gray-800">¡Aquí tienes tus ideas para Reels!</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {ideas.map((idea, index) => (
                <IdeaCard key={index} idea={idea} index={index} />
              ))}
            </div>
          </div>
        )}
        
        {!isLoading && !ideas && !error && (
          <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-lg border border-gray-200">
              <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tus ideas de Reels aparecerán aquí</h3>
              <p className="mt-1 text-sm text-gray-500">Completa el formulario para recibir ideas de videos virales.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
