
import React, { useState } from 'react';
import { Post, User } from '../types';
import { DB } from '../services/db';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onUpdate: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onUpdate }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;

  const handleLike = () => {
    if (!currentUser) return;
    const newLikes = isLiked 
      ? post.likes.filter(id => id !== currentUser.id)
      : [...post.likes, currentUser.id];
    
    DB.updatePost({ ...post, likes: newLikes });
    onUpdate();
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim()) return;

    const newComment = {
      id: 'c' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text: commentText,
      timestamp: Date.now()
    };

    DB.updatePost({ ...post, comments: [...post.comments, newComment] });
    setCommentText('');
    onUpdate();
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <img src={post.userAvatar} alt="" className="w-10 h-10 rounded-full border border-gray-100" />
          <div>
            <h3 className="font-semibold text-sm hover:underline cursor-pointer">{post.userName}</h3>
            <p className="text-xs text-gray-500">
              {post.isSponsored ? 'Sponsored' : new Date(post.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:bg-gray-100 p-1 rounded-full">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
        </button>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Media */}
      {post.mediaUrl && (
        <div className="mb-3 -mx-4">
          <img src={post.mediaUrl} alt="" className="w-full object-cover max-h-[500px]" />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 py-2 border-b border-gray-100 mb-2">
        <div className="flex items-center space-x-1">
          <span className="bg-blue-500 text-white p-0.5 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </span>
          <span>{post.likes.length}</span>
        </div>
        <div className="flex space-x-2">
          <span>{post.comments.length} comments</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-around border-b border-gray-100 pb-1 mb-2">
        <button 
          onClick={handleLike}
          className={`flex items-center justify-center space-x-2 flex-1 py-2 hover:bg-gray-100 rounded-lg transition ${isLiked ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
        >
          <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.708C19.746 10 21 11.277 21 12.856v.144c0 .324-.055.638-.158.932l-2.002 5.75c-.322.923-1.144 1.562-2.122 1.562H7M7 20H5a2 2 0 01-2-2V9a2 2 0 012-2h2m0 13V7m0 13l3.528-3.528c.176-.176.26-.425.26-.672V10" /></svg>
          <span>Like</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center space-x-2 flex-1 py-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span>Comment</span>
        </button>
        <button className="flex items-center justify-center space-x-2 flex-1 py-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-3 mt-2">
          {post.comments.map(c => (
            <div key={c.id} className="flex space-x-2">
              <img src={c.userAvatar} alt="" className="w-8 h-8 rounded-full" />
              <div className="bg-gray-100 p-2 rounded-2xl flex-1">
                <p className="text-xs font-bold">{c.userName}</p>
                <p className="text-sm">{c.text}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleComment} className="flex space-x-2 items-center">
            <img src={currentUser?.avatar} alt="" className="w-8 h-8 rounded-full" />
            <input 
              type="text" 
              placeholder="Write a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="bg-gray-100 rounded-full px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </form>
        </div>
      )}
    </div>
  );
};
