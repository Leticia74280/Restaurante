
import { useState, useEffect } from 'react';
import { reservationStore } from '../store/reservationStore';
import { Reservation, RestaurantSettings } from '../types';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  useEffect(() => {
    setReservations(reservationStore.getReservations());
    setSettings(reservationStore.getSettings());

    const unsubscribe = reservationStore.subscribe(() => {
      setReservations(reservationStore.getReservations());
      setSettings(reservationStore.getSettings());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    reservations,
    settings,
    getUserReservations: reservationStore.getUserReservations.bind(reservationStore),
    createReservation: reservationStore.createReservation.bind(reservationStore),
    updateReservation: reservationStore.updateReservation.bind(reservationStore),
    cancelReservation: reservationStore.cancelReservation.bind(reservationStore),
    getAvailableTimeSlots: reservationStore.getAvailableTimeSlots.bind(reservationStore),
    updateSettings: reservationStore.updateSettings.bind(reservationStore),
    addTable: reservationStore.addTable.bind(reservationStore),
    updateTable: reservationStore.updateTable.bind(reservationStore),
    removeTable: reservationStore.removeTable.bind(reservationStore)
  };
}
