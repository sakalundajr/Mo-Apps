
import { User, Post, Message, Product, Group } from '../types';

const STORAGE_KEYS = {
  USERS: 'socialsphere_users',
  POSTS: 'socialsphere_posts',
  MESSAGES: 'socialsphere_messages',
  PRODUCTS: 'socialsphere_products',
  GROUPS: 'socialsphere_groups',
  CURRENT_USER: 'socialsphere_active_user'
};

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex@test.com',
    avatar: 'https://picsum.photos/seed/alex/200',
    coverPhoto: 'https://picsum.photos/seed/alex-cover/1000/300',
    friends: ['u2', 'u3'],
    bio: 'Software enthusiast and coffee lover.'
  },
  {
    id: 'u2',
    name: 'Sarah Smith',
    email: 'sarah@test.com',
    avatar: 'https://picsum.photos/seed/sarah/200',
    coverPhoto: 'https://picsum.photos/seed/sarah-cover/1000/300',
    friends: ['u1'],
    bio: 'Digital nomad exploring the world.'
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    userName: 'Alex Johnson',
    userAvatar: 'https://picsum.photos/seed/alex/200',
    type: 'image',
    content: 'Loving the mountain views today!',
    mediaUrl: 'https://picsum.photos/seed/mtn/800/600',
    likes: ['u2'],
    comments: [],
    shares: 2,
    timestamp: Date.now() - 3600000
  },
  {
    id: 'p2',
    userId: 'u2',
    userName: 'Sarah Smith',
    userAvatar: 'https://picsum.photos/seed/sarah/200',
    type: 'text',
    content: 'Just finished my first React project. Feeling amazing!',
    likes: ['u1'],
    comments: [{ id: 'c1', userId: 'u1', userName: 'Alex Johnson', userAvatar: 'https://picsum.photos/seed/alex/200', text: 'Congrats Sarah! Great job.', timestamp: Date.now() }],
    shares: 0,
    timestamp: Date.now() - 7200000
  },
  {
    id: 'p3',
    userId: 'system',
    userName: 'SocialSphere Ads',
    userAvatar: 'https://picsum.photos/seed/ad/200',
    type: 'image',
    content: 'Get the new AI Assistant today. Boost your productivity!',
    mediaUrl: 'https://picsum.photos/seed/office/800/400',
    likes: [],
    comments: [],
    shares: 10,
    timestamp: Date.now(),
    isSponsored: true
  }
];

export const DB = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  },

  getPosts: (): Post[] => {
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(data);
  },

  savePost: (post: Post) => {
    const posts = DB.getPosts();
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([post, ...posts]));
  },

  updatePost: (updatedPost: Post) => {
    const posts = DB.getPosts().map(p => p.id === updatedPost.id ? updatedPost : p);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  login: (email: string): User | null => {
    const users = DB.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  signup: (name: string, email: string): User => {
    const newUser: User = {
      id: 'u' + Date.now(),
      name,
      email,
      avatar: `https://picsum.photos/seed/${name}/200`,
      coverPhoto: `https://picsum.photos/seed/${name}-cover/1000/300`,
      friends: [],
      bio: 'New SocialSphere user'
    };
    const users = DB.getUsers();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, newUser]));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  saveProduct: (product: Product) => {
    const products = DB.getProducts();
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([product, ...products]));
  }
};
