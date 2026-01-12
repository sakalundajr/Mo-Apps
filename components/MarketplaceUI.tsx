
import React, { useState, useEffect } from 'react';
import { Product, User } from '../types';
import { DB } from '../services/db';
// Added MarketplaceIcon to the imports
import { SearchIcon, MarketplaceIcon } from './Icons';

export const MarketplaceUI: React.FC<{ currentUser: User | null }> = ({ currentUser }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showSellModal, setShowSellModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', category: '', location: '', desc: '' });

  useEffect(() => {
    setProducts(DB.getProducts());
  }, []);

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const product: Product = {
      id: 'p' + Date.now(),
      sellerId: currentUser.id,
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      location: newProduct.location,
      category: newProduct.category,
      description: newProduct.desc,
      image: `https://picsum.photos/seed/${newProduct.title}/400/400`
    };
    DB.saveProduct(product);
    setProducts(DB.getProducts());
    setShowSellModal(false);
    setNewProduct({ title: '', price: '', category: '', location: '', desc: '' });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 flex gap-6">
      {/* Sidebar */}
      <div className="w-1/4 hidden lg:block">
        <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Marketplace" 
            className="w-full bg-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <button className="w-full text-left p-2 bg-blue-50 text-blue-600 rounded-lg font-semibold flex items-center space-x-2">
            <span>Browse All</span>
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex items-center space-x-2">
            <span>Notifications</span>
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex items-center space-x-2">
            <span>Inbox</span>
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-200 rounded-lg flex items-center space-x-2 font-semibold">
            <span>Your Account</span>
          </button>
        </div>
        <hr className="my-4" />
        <button 
          onClick={() => setShowSellModal(true)}
          className="w-full bg-blue-100 text-blue-600 py-2 rounded-lg font-bold hover:bg-blue-200 transition"
        >
          + Create New Listing
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Today's Picks</h2>
          <span className="text-blue-600 text-sm cursor-pointer hover:underline">New York · 40mi</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-500">
              <MarketplaceIcon className="w-20 h-20 mx-auto mb-4 opacity-20" />
              <p>No listings found. Be the first to sell something!</p>
            </div>
          ) : (
            products.map(p => (
              <div key={p.id} className="bg-white rounded-lg shadow overflow-hidden group cursor-pointer">
                <div className="aspect-square relative overflow-hidden">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt="" />
                </div>
                <div className="p-3">
                  <p className="font-bold text-lg">${p.price}</p>
                  <p className="text-sm text-gray-800 line-clamp-1">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.location}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">New Listing</h2>
              <button onClick={() => setShowSellModal(false)} className="text-gray-500 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSell} className="p-4 space-y-4">
              <input 
                required
                className="w-full border p-2 rounded" 
                placeholder="What are you selling?"
                value={newProduct.title}
                onChange={e => setNewProduct({...newProduct, title: e.target.value})}
              />
              <input 
                required
                type="number"
                className="w-full border p-2 rounded" 
                placeholder="Price"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})}
              />
              <input 
                required
                className="w-full border p-2 rounded" 
                placeholder="Location"
                value={newProduct.location}
                onChange={e => setNewProduct({...newProduct, location: e.target.value})}
              />
              <select 
                className="w-full border p-2 rounded"
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="">Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Cars">Cars</option>
              </select>
              <textarea 
                className="w-full border p-2 rounded h-24" 
                placeholder="Description"
                value={newProduct.desc}
                onChange={e => setNewProduct({...newProduct, desc: e.target.value})}
              ></textarea>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">List Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
