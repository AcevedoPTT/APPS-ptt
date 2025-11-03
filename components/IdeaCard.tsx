
import React from 'react';
import type { PostIdea } from '../types';
import { LightbulbIcon, DocumentTextIcon, HashtagIcon, PhotographIcon } from './icons';

interface IdeaCardProps {
  idea: PostIdea;
  index: number;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index }) => {
  const colors = [
    'from-purple-500 to-indigo-500',
    'from-sky-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className={`p-4 bg-gradient-to-br ${colors[index % colors.length]}`}>
        <h3 className="text-xl font-bold text-white">Idea de Reel #{index + 1}</h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <LightbulbIcon className="w-6 h-6 text-yellow-400" />
            <h4 className="font-semibold text-gray-700">Título Sugerido</h4>
          </div>
          <p className="text-gray-800 font-medium pl-8">{idea.titulo}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="w-6 h-6 text-blue-500" />
            <h4 className="font-semibold text-gray-700">Texto del Reel</h4>
          </div>
          <p className="text-gray-600 pl-8 whitespace-pre-wrap">{idea.texto}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <HashtagIcon className="w-6 h-6 text-green-500" />
            <h4 className="font-semibold text-gray-700">Hashtags</h4>
          </div>
          <div className="flex flex-wrap gap-2 pl-8">
            {idea.hashtags.map((tag, i) => (
              <span key={i} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{`#${tag}`}</span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <PhotographIcon className="w-6 h-6 text-purple-500" />
            <h4 className="font-semibold text-gray-700">Sugerencia de Video</h4>
          </div>
          <p className="text-gray-600 pl-8 whitespace-pre-wrap">{idea.visual}</p>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;