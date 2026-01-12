
import React, { useState } from 'react';
import { User } from '../types';
import { DB } from '../services/db';
// Added MenuIcon to the imports
import { MessengerIcon, SearchIcon, CameraIcon, VideoIcon, MenuIcon } from './Icons';

export const MessengerUI: React.FC<{ currentUser: User | null }> = ({ currentUser }) => {
  const [activeChat, setActiveChat] = useState<User | null>(null);
  const [msg, setMsg] = useState('');
  const allUsers = DB.getUsers().filter(u => u.id !== currentUser?.id);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Chats</h1>
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><MenuIcon className="w-5 h-5" /></button>
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><CameraIcon className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="px-4 mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Messenger" 
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {allUsers.map(user => (
            <div 
              key={user.id} 
              onClick={() => setActiveChat(user)}
              className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-100 transition ${activeChat?.id === user.id ? 'bg-blue-50' : ''}`}
            >
              <div className="relative">
                <img src={user.avatar} className="w-12 h-12 rounded-full" alt="" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">Sent a photo · 2h</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={activeChat.avatar} className="w-10 h-10 rounded-full" alt="" />
                <div>
                  <p className="font-bold text-sm">{activeChat.name}</p>
                  <p className="text-xs text-green-500">Active Now</p>
                </div>
              </div>
              <div className="flex space-x-3 text-blue-600">
                <button className="p-2 hover:bg-gray-100 rounded-full"><VideoIcon className="w-6 h-6" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-full"><MessengerIcon className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start space-x-2">
                  <img src={activeChat.avatar} className="w-8 h-8 rounded-full" alt="" />
                  <div className="bg-white border p-3 rounded-2xl rounded-tl-none text-sm max-w-[70%]">
                    Hey! How's it going?
                  </div>
                </div>
                <div className="flex items-end justify-end space-x-2">
                  <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-br-none text-sm max-w-[70%]">
                    Going great! Just exploring SocialSphere.
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex items-center space-x-3">
              <button className="text-blue-600"><CameraIcon className="w-6 h-6" /></button>
              <input 
                type="text" 
                placeholder="Aa" 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="flex-1 bg-gray-100 rounded-full py-2 px-4 focus:outline-none"
              />
              <button className="text-blue-600 font-bold">Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessengerIcon className="w-20 h-20 mb-4 opacity-20" />
            <p className="text-lg font-semibold">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};
