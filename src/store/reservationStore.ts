
import { Reservation, Table, RestaurantSettings } from '../types';

let mockReservations: Reservation[] = [
  {
    id: '1',
    userId: '2',
    customerName: 'João Silva',
    customerEmail: 'joao@email.com',
    customerPhone: '(11) 98888-8888',
    date: '2024-05-27',
    time: '19:30',
    guests: 4,
    tableNumber: 1,
    status: 'confirmed',
    createdAt: '2024-05-26T10:00:00Z',
    paymentStatus: 'paid',
    amount: 10
  },
  {
    id: '2',
    userId: '2',
    customerName: 'João Silva',
    customerEmail: 'joao@email.com',
    customerPhone: '(11) 98888-8888',
    date: '2024-05-25',
    time: '20:00',
    guests: 2,
    tableNumber: 3,
    status: 'confirmed',
    createdAt: '2024-05-24T15:30:00Z',
    paymentStatus: 'paid',
    amount: 10
  }
];

let mockSettings: RestaurantSettings = {
  openingTime: '18:00',
  closingTime: '23:00',
  slotDuration: 30,
  reservationPrice: 10,
  tables: [
    { id: '1', number: 1, capacity: 4, isAvailable: true },
    { id: '2', number: 2, capacity: 2, isAvailable: true },
    { id: '3', number: 3, capacity: 6, isAvailable: true },
    { id: '4', number: 4, capacity: 4, isAvailable: true },
    { id: '5', number: 5, capacity: 8, isAvailable: true },
    { id: '6', number: 6, capacity: 2, isAvailable: true },
  ]
};

class ReservationStore {
  private static instance: ReservationStore;
  private listeners: Set<() => void> = new Set();

  static getInstance(): ReservationStore {
    if (!ReservationStore.instance) {
      ReservationStore.instance = new ReservationStore();
    }
    return ReservationStore.instance;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  private sendConfirmationEmail(reservation: Reservation) {
    // Simulação de envio de e-mail
    console.log(`E-mail de confirmação enviado para ${reservation.customerEmail}`);
    console.log(`Reserva confirmada para ${reservation.customerName} - Mesa ${reservation.tableNumber} - ${reservation.date} às ${reservation.time}`);
    console.log(`Valor pago: R$ ${reservation.amount.toFixed(2)}`);
  }

  getReservations(): Reservation[] {
    return mockReservations;
  }

  getUserReservations(userId: string): Reservation[] {
    return mockReservations.filter(r => r.userId === userId);
  }

  createReservation(reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'amount'>): Reservation {
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString(),
      status: 'confirmed',
      paymentStatus: 'paid',
      amount: mockSettings.reservationPrice,
      createdAt: new Date().toISOString()
    };

    mockReservations.push(newReservation);
    this.sendConfirmationEmail(newReservation);
    this.notify();
    return newReservation;
  }

  updateReservation(id: string, updates: Partial<Reservation>): Reservation | null {
    const index = mockReservations.findIndex(r => r.id === id);
    if (index === -1) return null;

    mockReservations[index] = { ...mockReservations[index], ...updates };
    this.notify();
    return mockReservations[index];
  }

  cancelReservation(id: string): boolean {
    const reservation = mockReservations.find(r => r.id === id);
    if (!reservation) return false;

    reservation.status = 'cancelled';
    reservation.paymentStatus = 'refunded';
    console.log(`Reserva cancelada - Reembolso de R$ ${reservation.amount.toFixed(2)} processado para ${reservation.customerEmail}`);
    this.notify();
    return true;
  }

  getAvailableTimeSlots(date: string, guests: number): string[] {
    const settings = this.getSettings();
    const reservationsForDate = mockReservations.filter(
      r => r.date === date && r.status !== 'cancelled'
    );

    const timeSlots: string[] = [];
    const [openHour, openMin] = settings.openingTime.split(':').map(Number);
    const [closeHour, closeMin] = settings.closingTime.split(':').map(Number);

    let currentTime = openHour * 60 + openMin;
    const endTime = closeHour * 60 + closeMin;

    while (currentTime < endTime) {
      const hour = Math.floor(currentTime / 60);
      const minute = currentTime % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      // Check if there's an available table for this time
      const availableTables = settings.tables.filter(table => 
        table.capacity >= guests && 
        !reservationsForDate.some(r => r.time === timeString && r.tableNumber === table.number)
      );

      if (availableTables.length > 0) {
        timeSlots.push(timeString);
      }

      currentTime += settings.slotDuration;
    }

    return timeSlots;
  }

  getSettings(): RestaurantSettings {
    return mockSettings;
  }

  updateSettings(settings: Partial<RestaurantSettings>): void {
    mockSettings = { ...mockSettings, ...settings };
    this.notify();
  }

  addTable(table: Omit<Table, 'id'>): void {
    const newTable: Table = {
      ...table,
      id: Date.now().toString()
    };
    mockSettings.tables.push(newTable);
    this.notify();
  }

  updateTable(id: string, updates: Partial<Table>): void {
    const index = mockSettings.tables.findIndex(t => t.id === id);
    if (index !== -1) {
      mockSettings.tables[index] = { ...mockSettings.tables[index], ...updates };
      this.notify();
    }
  }

  removeTable(id: string): void {
    mockSettings.tables = mockSettings.tables.filter(t => t.id !== id);
    this.notify();
  }
}

export const reservationStore = ReservationStore.getInstance();
