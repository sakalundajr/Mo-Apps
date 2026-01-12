
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  friends: string[];
  coverPhoto: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'text' | 'image' | 'video' | 'ad';
  content: string;
  mediaUrl?: string;
  likes: string[]; // array of user IDs
  comments: Comment[];
  shares: number;
  timestamp: number;
  isSponsored?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image: string;
  category: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  cover: string;
  members: string[];
  isPrivate: boolean;
}

export enum ViewMode {
  FEED = 'FEED',
  MESSENGER = 'MESSENGER',
  WATCH = 'WATCH',
  MARKETPLACE = 'MARKETPLACE',
  GROUPS = 'GROUPS',
  GAMING = 'GAMING',
  PROFILE = 'PROFILE',
  AUTH = 'AUTH'
}
