
import React, { useState } from 'react';
import { User, Post } from '../types';
import { DB } from '../services/db';
import { generatePostCaption, moderateContent } from '../services/gemini';
import { CameraIcon, VideoIcon } from './Icons';

interface CreatePostModalProps {
  currentUser: User | null;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ currentUser, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'text' | 'image' | 'video'>('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handlePost = async () => {
    if (!currentUser || !content.trim()) return;

    // Optional: Content Moderation via Gemini
    const isSafe = await moderateContent(content);
    if (!isSafe) {
      setError("Post violates community guidelines.");
      return;
    }

    const newPost: Post = {
      id: 'p' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: mediaType,
      content,
      mediaUrl: mediaType !== 'text' ? `https://picsum.photos/seed/${Date.now()}/800/600` : undefined,
      likes: [],
      comments: [],
      shares: 0,
      timestamp: Date.now()
    };

    DB.savePost(newPost);
    onPostCreated();
    onClose();
  };

  const handleAiAssist = async () => {
    if (!content.trim()) {
      setError("Type a topic first for AI to help!");
      return;
    }
    setIsGenerating(true);
    const aiCaption = await generatePostCaption(content);
    setContent(aiCaption);
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b flex justify-between items-center relative">
          <h2 className="text-xl font-bold w-full text-center">Create Post</h2>
          <button onClick={onClose} className="absolute right-4 text-gray-500 bg-gray-100 p-1 rounded-full hover:bg-gray-200">&times;</button>
        </div>
        
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center space-x-2 mb-4">
            <img src={currentUser?.avatar} className="w-10 h-10 rounded-full" alt="" />
            <div>
              <p className="font-bold text-sm">{currentUser?.name}</p>
              <div className="bg-gray-200 text-xs px-2 py-0.5 rounded flex items-center space-x-1 cursor-pointer">
                <span>Public</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          <textarea 
            placeholder={`What's on your mind, ${currentUser?.name?.split(' ')[0]}?`}
            className={`w-full text-lg resize-none min-h-[150px] focus:outline-none ${content.length > 80 ? 'text-lg' : 'text-2xl'}`}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError('');
            }}
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <div className="border rounded-lg p-3 mb-4 flex items-center justify-between">
            <p className="font-semibold text-sm">Add to your post</p>
            <div className="flex space-x-2">
              <button 
                onClick={() => setMediaType('image')}
                className={`p-2 rounded-full hover:bg-gray-100 ${mediaType === 'image' ? 'text-green-500 bg-green-50' : 'text-green-500'}`}
              >
                <CameraIcon />
              </button>
              <button 
                onClick={() => setMediaType('video')}
                className={`p-2 rounded-full hover:bg-gray-100 ${mediaType === 'video' ? 'text-red-500 bg-red-50' : 'text-red-500'}`}
              >
                <VideoIcon />
              </button>
            </div>
          </div>

          <button 
            disabled={isGenerating}
            onClick={handleAiAssist}
            className="w-full mb-3 flex items-center justify-center space-x-2 border border-blue-200 text-blue-600 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
          >
            {isGenerating ? 'AI is thinking...' : '✨ AI Caption Assist'}
          </button>
        </div>

        <div className="p-4 pt-0">
          <button 
            disabled={!content.trim()}
            onClick={handlePost}
            className={`w-full py-2 rounded-lg font-bold text-white transition ${content.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
