
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useReservations } from '../hooks/useReservations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Users, Settings, Plus, Edit, X, CreditCard, DollarSign } from 'lucide-react';
import { Reservation, Table as TableType } from '../types';
import { toast } from '../hooks/use-toast';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    reservations, 
    settings, 
    updateSettings, 
    addTable, 
    updateTable, 
    removeTable,
    updateReservation
  } = useReservations();

  const [settingsForm, setSettingsForm] = useState({
    openingTime: '',
    closingTime: '',
    slotDuration: 30,
    reservationPrice: 10
  });

  const [newTable, setNewTable] = useState({
    number: '',
    capacity: ''
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        openingTime: settings.openingTime,
        closingTime: settings.closingTime,
        slotDuration: settings.slotDuration,
        reservationPrice: settings.reservationPrice || 10
      });
    }
  }, [settings]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const todayReservations = reservations.filter(r => {
    const today = new Date().toISOString().split('T')[0];
    return r.date === today && r.status === 'confirmed';
  });

  const allActiveReservations = reservations.filter(r => 
    r.status === 'confirmed' && new Date(r.date + ' ' + r.time) >= new Date()
  );

  const totalRevenue = reservations
    .filter(r => r.paymentStatus === 'paid')
    .reduce((sum, r) => sum + r.amount, 0);

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    toast({
      title: "Configurações atualizadas",
      description: "As configurações do restaurante foram salvas."
    });
  };

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTable.number || !newTable.capacity) return;

    addTable({
      number: parseInt(newTable.number),
      capacity: parseInt(newTable.capacity),
      isAvailable: true
    });

    setNewTable({ number: '', capacity: '' });
    toast({
      title: "Mesa adicionada",
      description: `Mesa ${newTable.number} foi adicionada com sucesso.`
    });
  };

  const handleRemoveTable = (tableId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta mesa?')) {
      removeTable(tableId);
      toast({
        title: "Mesa removida",
        description: "A mesa foi removida com sucesso."
      });
    }
  };

  const handleUpdateReservationStatus = (reservationId: string, status: 'confirmed' | 'cancelled') => {
    updateReservation(reservationId, { status });
    toast({
      title: "Reserva atualizada",
      description: `Status da reserva alterado para ${status === 'confirmed' ? 'confirmada' : 'cancelada'}.`
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
      <Badge variant={variants[paymentStatus as keyof typeof variants]}>
        <CreditCard className="w-3 h-3 mr-1" />
        {labels[paymentStatus as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">Gerencie reservas, mesas e configurações do restaurante</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-500">{todayReservations.length}</div>
              <div className="text-gray-600">Reservas Hoje</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-500">{allActiveReservations.length}</div>
              <div className="text-gray-600">Total Ativas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-500">{settings?.tables.length || 0}</div>
              <div className="text-gray-600">Mesas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-500">
                {settings?.tables.reduce((sum, table) => sum + table.capacity, 0) || 0}
              </div>
              <div className="text-gray-600">Capacidade Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">R$ {totalRevenue.toFixed(2)}</div>
              <div className="text-gray-600">Receita Total</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reservations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reservations">Reservas</TabsTrigger>
            <TabsTrigger value="tables">Mesas</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reservations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Pessoas</TableHead>
                      <TableHead>Mesa</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-mono text-xs">{reservation.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{reservation.customerName}</div>
                            <div className="text-sm text-gray-500">{reservation.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(reservation.date)}</TableCell>
                        <TableCell>{reservation.time}</TableCell>
                        <TableCell>{reservation.guests}</TableCell>
                        <TableCell>Mesa {reservation.tableNumber}</TableCell>
                        <TableCell>R$ {reservation.amount.toFixed(2)}</TableCell>
                        <TableCell>{getPaymentBadge(reservation.paymentStatus)}</TableCell>
                        <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {reservation.status === 'confirmed' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateReservationStatus(reservation.id, 'cancelled')}
                              >
                                Cancelar
                              </Button>
                            )}
                            {reservation.status === 'cancelled' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed')}
                              >
                                Reativar
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tables" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mesas Cadastradas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {settings?.tables.map((table) => (
                      <div key={table.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">Mesa {table.number}</div>
                          <div className="text-sm text-gray-500">
                            Capacidade: {table.capacity} pessoas
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={table.isAvailable ? 'default' : 'secondary'}>
                            {table.isAvailable ? 'Disponível' : 'Indisponível'}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemoveTable(table.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Nova Mesa</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTable} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="table-number">Número da Mesa</Label>
                      <Input
                        id="table-number"
                        type="number"
                        value={newTable.number}
                        onChange={(e) => setNewTable(prev => ({ ...prev, number: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="table-capacity">Capacidade (pessoas)</Label>
                      <Input
                        id="table-capacity"
                        type="number"
                        min="1"
                        max="20"
                        value={newTable.capacity}
                        onChange={(e) => setNewTable(prev => ({ ...prev, capacity: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Mesa
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Restaurante</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="opening-time">Horário de Abertura</Label>
                      <Input
                        id="opening-time"
                        type="time"
                        value={settingsForm.openingTime}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, openingTime: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closing-time">Horário de Fechamento</Label>
                      <Input
                        id="closing-time"
                        type="time"
                        value={settingsForm.closingTime}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, closingTime: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slot-duration">Duração dos Slots (minutos)</Label>
                      <Input
                        id="slot-duration"
                        type="number"
                        min="15"
                        max="120"
                        step="15"
                        value={settingsForm.slotDuration}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, slotDuration: parseInt(e.target.value) }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reservation-price">Preço da Reserva (R$)</Label>
                      <Input
                        id="reservation-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={settingsForm.reservationPrice}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, reservationPrice: parseFloat(e.target.value) }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit">
                    <Settings className="w-4 h-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
