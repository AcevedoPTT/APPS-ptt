
import React, { useState } from 'react';
import type { PostIdea } from '../types';
import { LightbulbIcon, DocumentTextIcon, HashtagIcon, PhotographIcon, SearchIcon } from './icons';

interface IdeaCardProps {
  idea: PostIdea;
  index: number;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index }) => {
  const [searchQuery, setSearchQuery] = useState(idea.guion.gancho.busqueda_imagen_referencia);
  
  const colors = [
    'from-purple-500 to-indigo-500',
    'from-sky-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
  ];

  const googleSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className={`p-4 bg-gradient-to-br ${colors[index % colors.length]}`}>
        <h3 className="text-xl font-bold text-white">Idea de Reel #{index + 1}</h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <LightbulbIcon className="w-6 h-6 text-yellow-400" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Título Sugerido</h4>
          </div>
          <p className="text-gray-800 dark:text-gray-100 font-medium pl-8">{idea.titulo}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="w-6 h-6 text-blue-500" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Guion del Reel</h4>
          </div>
          <div className="pl-8 space-y-4 border-l-2 border-blue-100 dark:border-blue-900 ml-3">
            <div className="pl-5">
              <h5 className="font-semibold text-sm text-blue-800 dark:text-blue-300">Gancho (Hook)</h5>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{idea.guion.gancho.texto}</p>
              <div className="mt-2 space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Buscar imagen de referencia:</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full flex-grow px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                  <a 
                    href={googleSearchUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                    aria-label="Buscar imagen"
                  >
                    <SearchIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            <div className="pl-5">
              <h5 className="font-semibold text-sm text-blue-800 dark:text-blue-300">Desarrollo</h5>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{idea.guion.desarrollo}</p>
            </div>
            <div className="pl-5">
              <h5 className="font-semibold text-sm text-blue-800 dark:text-blue-300">Llamado a la Acción (CTA)</h5>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{idea.guion.cta}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <HashtagIcon className="w-6 h-6 text-green-500" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Hashtags</h4>
          </div>
          <div className="flex flex-wrap gap-2 pl-8">
            {idea.hashtags.map((tag, i) => (
              <span key={i} className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-sm font-medium px-3 py-1 rounded-full">{`#${tag}`}</span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <PhotographIcon className="w-6 h-6 text-purple-500" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Sugerencia de Video</h4>
          </div>
          <p className="text-gray-600 dark:text-gray-300 pl-8 whitespace-pre-wrap">{idea.sugerencia_visual}</p>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;