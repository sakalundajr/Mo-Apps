
import React, { useState, useEffect } from 'react';
import { ViewMode, User, Post } from './types';
import { DB } from './services/db';
// Added VideoIcon and CameraIcon to the imports
import { HomeIcon, WatchIcon, MarketplaceIcon, GroupsIcon, MessengerIcon, BellIcon, SearchIcon, MenuIcon, VideoIcon, CameraIcon } from './components/Icons';
import { PostCard } from './components/PostCard';
import { MessengerUI } from './components/MessengerUI';
import { MarketplaceUI } from './components/MarketplaceUI';
import { CreatePostModal } from './components/CreatePostModal';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.FEED);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [authData, setAuthData] = useState({ name: '', email: '' });

  useEffect(() => {
    const user = DB.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      setView(ViewMode.AUTH);
    }
    setPosts(DB.getPosts());
  }, []);

  const refreshData = () => {
    setPosts(DB.getPosts());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = DB.login(authData.email);
    if (user) {
      setCurrentUser(user);
      setView(ViewMode.FEED);
    } else {
      const newUser = DB.signup(authData.name || 'New User', authData.email);
      setCurrentUser(newUser);
      setView(ViewMode.FEED);
    }
  };

  const handleLogout = () => {
    DB.logout();
    setCurrentUser(null);
    setView(ViewMode.AUTH);
  };

  if (view === ViewMode.AUTH) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col lg:flex-row items-center justify-center p-4 lg:p-20 gap-8 lg:gap-20">
        <div className="max-w-md text-center lg:text-left">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">socialsphere</h1>
          <p className="text-2xl font-medium">Connect with friends and the world around you on SocialSphere.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-[400px]">
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              required
              type="text" 
              placeholder="Full Name (for new users)" 
              className="w-full border border-gray-300 p-3 rounded-md text-lg focus:outline-blue-500"
              value={authData.name}
              onChange={(e) => setAuthData({...authData, name: e.target.value})}
            />
            <input 
              required
              type="email" 
              placeholder="Email address" 
              className="w-full border border-gray-300 p-3 rounded-md text-lg focus:outline-blue-500"
              value={authData.email}
              onChange={(e) => setAuthData({...authData, email: e.target.value})}
            />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold text-xl py-3 rounded-md hover:bg-blue-700 transition">Log In / Sign Up</button>
            <div className="text-center">
              <a href="#" className="text-blue-500 text-sm hover:underline">Forgotten password?</a>
            </div>
            <hr />
            <div className="flex justify-center">
              <button type="button" className="bg-[#42b72a] text-white font-bold py-3 px-6 rounded-md hover:bg-[#36a420] transition">Create new account</button>
            </div>
          </form>
          <p className="mt-4 text-sm text-center"><b>Create a Page</b> for a celebrity, brand or business.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm flex items-center justify-between px-4 h-14 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="text-blue-600 text-4xl font-bold cursor-pointer" onClick={() => setView(ViewMode.FEED)}>s</div>
          <div className="relative hidden md:block">
            <SearchIcon className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search SocialSphere" 
              className="bg-gray-100 rounded-full py-2 pl-9 pr-4 text-sm w-60 focus:outline-none"
            />
          </div>
        </div>

        <nav className="flex-1 flex justify-center h-full">
          <button onClick={() => setView(ViewMode.FEED)} className={`px-10 h-full border-b-4 flex items-center justify-center transition ${view === ViewMode.FEED ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}>
            <HomeIcon className="w-7 h-7" />
          </button>
          <button onClick={() => setView(ViewMode.WATCH)} className={`px-10 h-full border-b-4 flex items-center justify-center transition ${view === ViewMode.WATCH ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}>
            <WatchIcon className="w-7 h-7" />
          </button>
          <button onClick={() => setView(ViewMode.MARKETPLACE)} className={`px-10 h-full border-b-4 flex items-center justify-center transition ${view === ViewMode.MARKETPLACE ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}>
            <MarketplaceIcon className="w-7 h-7" />
          </button>
          <button onClick={() => setView(ViewMode.GROUPS)} className={`px-10 h-full border-b-4 flex items-center justify-center transition ${view === ViewMode.GROUPS ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}>
            <GroupsIcon className="w-7 h-7" />
          </button>
        </nav>

        <div className="flex items-center space-x-2">
          <div 
            onClick={() => setView(ViewMode.PROFILE)}
            className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <img src={currentUser?.avatar} className="w-8 h-8 rounded-full" alt="" />
            <span className="font-semibold text-sm hidden lg:block">{currentUser?.name.split(' ')[0]}</span>
          </div>
          <button onClick={() => setView(ViewMode.MESSENGER)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><MessengerIcon className="w-5 h-5" /></button>
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><BellIcon className="w-5 h-5" /></button>
          <button onClick={handleLogout} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 bg-[#f0f2f5] min-h-0">
        {view === ViewMode.FEED && (
          <div className="max-w-[1200px] mx-auto flex pt-4 gap-8">
            {/* Sidebar Left */}
            <aside className="w-[300px] hidden xl:block sticky top-[76px] h-fit">
              <div className="space-y-1">
                <div onClick={() => setView(ViewMode.PROFILE)} className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
                  <img src={currentUser?.avatar} className="w-8 h-8 rounded-full" alt="" />
                  <span className="font-semibold">{currentUser?.name}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
                  <GroupsIcon className="w-8 h-8 text-blue-500" />
                  <span className="font-semibold">Groups</span>
                </div>
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
                  <MarketplaceIcon className="w-8 h-8 text-blue-500" />
                  <span className="font-semibold">Marketplace</span>
                </div>
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
                  <WatchIcon className="w-8 h-8 text-blue-500" />
                  <span className="font-semibold">Watch</span>
                </div>
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
                  <svg className="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 14h2v2h-2v-2zm0-4h2v2h-2v-2z" /></svg>
                  <span className="font-semibold">Memories</span>
                </div>
              </div>
            </aside>

            {/* Feed Center */}
            <div className="flex-1 max-w-[680px] mx-auto pb-10">
              {/* Post Input */}
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex items-center space-x-2 mb-4">
                  <img src={currentUser?.avatar} className="w-10 h-10 rounded-full" alt="" />
                  <div 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gray-100 rounded-full px-4 py-2 flex-1 cursor-pointer hover:bg-gray-200 text-gray-500 transition"
                  >
                    What's on your mind, {currentUser?.name.split(' ')[0]}?
                  </div>
                </div>
                <hr className="mb-2" />
                <div className="flex justify-around">
                  <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg flex-1 justify-center transition">
                    <VideoIcon className="text-red-500" />
                    <span className="font-semibold text-sm text-gray-600">Live Video</span>
                  </button>
                  <button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg flex-1 justify-center transition">
                    <CameraIcon className="text-green-500" />
                    <span className="font-semibold text-sm text-gray-600">Photo/Video</span>
                  </button>
                  <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg flex-1 justify-center transition">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/></svg>
                    <span className="font-semibold text-sm text-gray-600">Feeling/Activity</span>
                  </button>
                </div>
              </div>

              {/* Posts */}
              {posts.map(post => (
                <PostCard key={post.id} post={post} currentUser={currentUser} onUpdate={refreshData} />
              ))}
            </div>

            {/* Right Bar */}
            <aside className="w-[300px] hidden lg:block sticky top-[76px] h-fit">
              <div className="space-y-4">
                <div className="text-gray-500 font-semibold mb-2">Sponsored</div>
                <div className="flex space-x-4 p-2 hover:bg-gray-200 rounded-lg cursor-pointer">
                  <img src="https://picsum.photos/seed/ad1/100/100" className="w-24 h-24 rounded-lg object-cover" alt="" />
                  <div>
                    <p className="font-semibold text-sm line-clamp-2">New Tech Gadget 2024 - Buy Now</p>
                    <p className="text-xs text-gray-500">techdeals.com</p>
                  </div>
                </div>
                <hr />
                <div className="flex justify-between items-center text-gray-500 font-semibold px-2">
                  <span>Contacts</span>
                  <div className="flex space-x-2">
                    <svg className="w-4 h-4 cursor-pointer hover:text-gray-800" fill="currentColor" viewBox="0 0 20 20"><path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" /></svg>
                    <svg className="w-4 h-4 cursor-pointer hover:text-gray-800" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2 s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                  </div>
                </div>
                <div className="space-y-1">
                  {DB.getUsers().filter(u => u.id !== currentUser?.id).map(user => (
                    <div key={user.id} onClick={() => setView(ViewMode.MESSENGER)} className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer">
                      <div className="relative">
                        <img src={user.avatar} className="w-8 h-8 rounded-full" alt="" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {view === ViewMode.MESSENGER && <MessengerUI currentUser={currentUser} />}
        {view === ViewMode.MARKETPLACE && <MarketplaceUI currentUser={currentUser} />}
        {view === ViewMode.GROUPS && <div className="p-20 text-center text-gray-500">Groups feature coming soon!</div>}
        {view === ViewMode.WATCH && <div className="p-20 text-center text-gray-500">Watch feature coming soon!</div>}
        {view === ViewMode.PROFILE && (
          <div className="max-w-4xl mx-auto bg-white shadow rounded-b-lg">
             <div className="h-64 bg-gray-200 relative">
               <img src={currentUser?.coverPhoto} className="w-full h-full object-cover" alt="" />
               <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                 <img src={currentUser?.avatar} className="w-40 h-40 rounded-full border-4 border-white shadow-lg" alt="" />
                 <h2 className="text-3xl font-bold mt-2">{currentUser?.name}</h2>
                 <p className="text-gray-500">{currentUser?.bio}</p>
               </div>
             </div>
             <div className="pt-24 pb-8 px-8 flex justify-center border-t mt-16 space-x-4">
               <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">+ Add to Story</button>
               <button className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg">Edit Profile</button>
             </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showCreateModal && (
        <CreatePostModal 
          currentUser={currentUser} 
          onClose={() => setShowCreateModal(false)} 
          onPostCreated={refreshData}
        />
      )}
    </div>
  );
};

export default App;
