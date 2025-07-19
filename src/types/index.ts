export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
}

export interface Lead {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  product: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  value: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (formData: FormData) => Promise<void>;
  logout: () => void;
}