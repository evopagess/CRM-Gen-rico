export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'canceled';
export type PaymentStatus = 'pending' | 'paid';
export type JobType = 'installation' | 'maintenance' | 'repair';

export interface Client {
  id: string;
  name: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
}

export interface Job {
  id: string;
  clientId: string;
  type: JobType;
  description: string;
  date: string; // ISO string
  price: number;
  jobStatus: JobStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  clientId: string;
  date: string;
  items: QuoteItem[];
  total: number;
  status: 'active' | 'completed';
  createdAt: string;
}

export interface Settings {
  companyName: string;
  logo?: string; // base64
  onboardingCompleted: boolean;
}

export interface AppState {
  clients: Client[];
  jobs: Job[];
  quotes: Quote[];
  settings: Settings;
}
