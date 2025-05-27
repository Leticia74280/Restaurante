
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useReservations } from '../hooks/useReservations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, MapPin, Edit, X, CreditCard } from 'lucide-react';
import { Reservation } from '../types';
import { toast } from '../hooks/use-toast';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { getUserReservations, cancelReservation } = useReservations();
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (user) {
      const reservations = getUserReservations(user.id);
      setUserReservations(reservations);
    }
  }, [user, getUserReservations]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const activeReservations = userReservations.filter(r => 
    r.status === 'confirmed' && new Date(r.date + ' ' + r.time) >= new Date()
  );

  const pastReservations = userReservations.filter(r => 
    r.status === 'confirmed' && new Date(r.date + ' ' + r.time) < new Date()
  );

  const cancelledReservations = userReservations.filter(r => r.status === 'cancelled');

  const handleCancelReservation = (reservationId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva? O valor pago será reembolsado.')) {
      const success = cancelReservation(reservationId);
      if (success) {
        // Atualizar a lista local de reservas
        const updatedReservations = getUserReservations(user!.id);
        setUserReservations(updatedReservations);
        toast({
          title: "Reserva cancelada",
          description: "Sua reserva foi cancelada e o reembolso será processado em até 5 dias úteis."
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível cancelar a reserva. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'default',
      pending: 'secondary',
      cancelled: 'destructive'
    } as const;

    const labels = {
      confirmed: 'Confirmada',
      pending: 'Pendente',
      cancelled: 'Cancelada'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const variants = {
      paid: 'default',
      pending: 'secondary',
      refunded: 'outline'
    } as const;

    const labels = {
      paid: 'Pago',
      pending: 'Pendente',
      refunded: 'Reembolsado'
    };

    return (
      <Badge variant={variants[paymentStatus as keyof typeof variants]} className="ml-2">
        <CreditCard className="w-3 h-3 mr-1" />
        {labels[paymentStatus as keyof typeof labels]}
      </Badge>
    );
  };

  const ReservationCard = ({ reservation, showCancelButton = false }: { 
    reservation: Reservation; 
    showCancelButton?: boolean; 
  }) => (
    <Card key={reservation.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">Mesa {reservation.tableNumber}</h3>
            <p className="text-gray-600">{formatDate(reservation.date)}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(reservation.status)}
            {getPaymentBadge(reservation.paymentStatus)}
            {showCancelButton && reservation.status === 'confirmed' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCancelReservation(reservation.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{reservation.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{reservation.guests} {reservation.guests === 1 ? 'pessoa' : 'pessoas'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <span>R$ {reservation.amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>ID: {reservation.id}</span>
          </div>
        </div>
        
        {reservation.specialRequests && (
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p className="text-sm"><strong>Observações:</strong> {reservation.specialRequests}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Reservas</h1>
          <p className="text-gray-600 mt-2">Gerencie suas reservas no Gourmet Experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-500">{activeReservations.length}</div>
              <div className="text-gray-600">Reservas Ativas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-500">{pastReservations.length}</div>
              <div className="text-gray-600">Reservas Passadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-500">{cancelledReservations.length}</div>
              <div className="text-gray-600">Canceladas</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Ativas ({activeReservations.length})</TabsTrigger>
            <TabsTrigger value="past">Passadas ({pastReservations.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Canceladas ({cancelledReservations.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            {activeReservations.length > 0 ? (
              activeReservations.map(reservation => (
                <ReservationCard 
                  key={reservation.id} 
                  reservation={reservation} 
                  showCancelButton={true}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma reserva ativa</h3>
                  <p className="text-gray-500">Faça uma nova reserva para aparecer aqui</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            {pastReservations.length > 0 ? (
              pastReservations.map(reservation => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma reserva passada</h3>
                  <p className="text-gray-500">Suas reservas anteriores aparecerão aqui</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-6">
            {cancelledReservations.length > 0 ? (
              cancelledReservations.map(reservation => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <X className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma reserva cancelada</h3>
                  <p className="text-gray-500">Reservas canceladas aparecerão aqui</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
