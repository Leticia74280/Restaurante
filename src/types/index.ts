
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}

export interface Reservation {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  tableNumber?: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
  createdAt: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  isAvailable: boolean;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export interface RestaurantSettings {
  openingTime: string;
  closingTime: string;
  slotDuration: number; // in minutes
  tables: Table[];
  reservationPrice: number;
}
