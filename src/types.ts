export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'canceled';
export type PaymentStatus = 'pending' | 'paid';
export type JobType = 'installation' | 'maintenance' | 'repair';

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
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
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface AppState {
  clients: Client[];
  jobs: Job[];
  quotes: Quote[];
}
