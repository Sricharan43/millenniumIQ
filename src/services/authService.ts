import type { User, StoredUser } from '../types';

const USERS_KEY = 'millenniumiq_users';
const SESSION_KEY = 'millenniumiq_session';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Get all stored users from localStorage
const getStoredUsers = (): StoredUser[] => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users: StoredUser[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

// Save session to localStorage
const saveSession = (user: User): void => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving session to localStorage:', error);
  }
};

// Basic password hashing (for demo purposes - use proper hashing in production)
const hashPassword = (password: string): string => {
  return btoa(password);
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

// Sign up a new user
export const signup = (
  email: string,
  password: string,
  fullName: string
): { success: boolean; message: string; user?: User } => {
  // Validation
  if (!email || !password || !fullName) {
    return { success: false, message: 'All fields are required' };
  }

  if (!isValidEmail(email)) {
    return { success: false, message: 'Please enter a valid email address' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters' };
  }

  // Check if user already exists
  const users = getStoredUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    return { success: false, message: 'An account with this email already exists' };
  }

  // Create and store new user
  const newStoredUser: StoredUser = {
    email: email.toLowerCase(),
    password: hashPassword(password),
    fullName: fullName.trim()
  };

  users.push(newStoredUser);
  saveUsers(users);

  // Create session
  const user: User = {
    email: newStoredUser.email,
    fullName: newStoredUser.fullName,
    isGuest: false
  };

  saveSession(user);

  return { success: true, message: 'Account created successfully', user };
};

// Log in an existing user
export const login = (
  email: string,
  password: string
): { success: boolean; message: string; user?: User } => {
  // Validation
  if (!email || !password) {
    return { success: false, message: 'Email and password are required' };
  }

  if (!isValidEmail(email)) {
    return { success: false, message: 'Please enter a valid email address' };
  }

  // Find user
  const users = getStoredUsers();
  const storedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!storedUser) {
    return { success: false, message: 'Invalid email or password' };
  }

  // Verify password
  if (storedUser.password !== hashPassword(password)) {
    return { success: false, message: 'Invalid email or password' };
  }

  // Create session
  const user: User = {
    email: storedUser.email,
    fullName: storedUser.fullName,
    isGuest: false
  };

  saveSession(user);

  return { success: true, message: 'Login successful', user };
};

// Log in as guest
export const loginAsGuest = (): User => {
  const guestUser: User = {
    email: 'guest@millenniumiq.app',
    fullName: 'Guest User',
    isGuest: true
  };

  saveSession(guestUser);

  return guestUser;
};

// Log out current user
export const logout = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

// Get current logged-in user
export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    
    const user = JSON.parse(stored) as User;
    return user;
  } catch (error) {
    console.error('Error reading session from localStorage:', error);
    return null;
  }
};
