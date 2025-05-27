
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
}

let mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@restaurant.com',
    phone: '(11) 99999-9999',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 98888-8888',
    role: 'customer',
    password: '123456'
  }
];

class AuthStore {
  private static instance: AuthStore;
  private listeners: Set<() => void> = new Set();
  
  public user: User | null = null;
  public isAuthenticated: boolean = false;

  static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }
    return AuthStore.instance;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  async login(email: string, password: string): Promise<void> {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const { password: _, ...userWithoutPassword } = user;
    this.user = userWithoutPassword;
    this.isAuthenticated = true;
    
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    this.notify();
  }

  async register(userData: Omit<User, 'id'> & { password: string }): Promise<void> {
    const existingUser = mockUsers.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('E-mail já cadastrado');
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      role: 'customer' as const
    };

    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    this.user = userWithoutPassword;
    this.isAuthenticated = true;
    
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    this.notify();
  }

  logout(): void {
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem('user');
    this.notify();
  }

  init(): void {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.isAuthenticated = true;
      this.notify();
    }
  }
}

export const authStore = AuthStore.getInstance();

// Import types
import { User } from '../types';
