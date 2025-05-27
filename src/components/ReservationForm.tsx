
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Clock, Users, QrCode, CreditCard } from 'lucide-react';
import { useReservations } from '../hooks/useReservations';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../hooks/use-toast';

interface ReservationFormProps {
  onSuccess?: () => void;
}

export function ReservationForm({ onSuccess }: ReservationFormProps) {
  const { user } = useAuth();
  const { createReservation, getAvailableTimeSlots, settings } = useReservations();
  
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: ''
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState<string>('');

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, date, time: '' }));
    
    if (date && formData.guests) {
      const slots = getAvailableTimeSlots(date, parseInt(formData.guests));
      setAvailableTimeSlots(slots);
    }
  };

  const handleGuestsChange = (guests: string) => {
    setFormData(prev => ({ ...prev, guests, time: '' }));
    
    if (formData.date && guests) {
      const slots = getAvailableTimeSlots(formData.date, parseInt(guests));
      setAvailableTimeSlots(slots);
    }
  };

  const handleProceedToPayment = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || 
        !formData.date || !formData.time || !formData.guests) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios antes de prosseguir.",
        variant: "destructive"
      });
      return;
    }
    setShowPayment(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentConfirmed !== 'sim') {
      toast({
        title: "Pagamento não confirmado",
        description: "Por favor, confirme que você efetuou o pagamento.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Find an available table
      const availableTable = settings?.tables.find(
        table => table.capacity >= parseInt(formData.guests)
      );

      const reservation = createReservation({
        userId: user?.id || 'guest',
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests),
        tableNumber: availableTable?.number,
        specialRequests: formData.specialRequests
      });

      toast({
        title: "Reserva confirmada!",
        description: `Sua mesa foi reservada para ${formData.date} às ${formData.time}. Confirmação enviada por e-mail.`,
      });

      // Reset form
      setFormData({
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: user?.phone || '',
        date: '',
        time: '',
        guests: '2',
        specialRequests: ''
      });
      setAvailableTimeSlots([]);
      setShowPayment(false);
      setPaymentConfirmed('');
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro ao fazer reserva",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const reservationPrice = settings?.reservationPrice || 10;

  if (showPayment) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Pagamento da Reserva
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Resumo da Reserva */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resumo da Reserva</h3>
              <div className="text-sm space-y-1">
                <p><strong>Nome:</strong> {formData.customerName}</p>
                <p><strong>Data:</strong> {new Date(formData.date).toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {formData.time}</p>
                <p><strong>Pessoas:</strong> {formData.guests}</p>
                <p className="text-lg font-bold text-orange-600 mt-2">
                  Total: R$ {reservationPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* QR Code de Pagamento */}
            <div className="text-center space-y-4">
              <h3 className="font-semibold">Escaneie o QR Code para pagar</h3>
              <div className="flex justify-center">
                <div className="bg-white p-4 border-2 border-gray-300 rounded-lg">
                  <QrCode size={200} className="text-gray-800" />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Use o PIX ou seu app de pagamento favorito
              </p>
            </div>

            {/* Confirmação de Pagamento */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Você efetuou o pagamento?
              </Label>
              <RadioGroup 
                value={paymentConfirmed} 
                onValueChange={setPaymentConfirmed}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="sim" />
                  <Label htmlFor="sim" className="cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="nao" />
                  <Label htmlFor="nao" className="cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowPayment(false)} 
                className="flex-1"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || paymentConfirmed !== 'sim'}
                className="flex-1"
              >
                {isLoading ? 'Confirmando...' : 'Confirmar Reserva'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Fazer Reserva
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome completo</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">E-mail</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Telefone</Label>
            <Input
              id="customerPhone"
              value={formData.customerPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                min={today}
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Número de pessoas</Label>
              <Select value={formData.guests} onValueChange={handleGuestsChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {num} {num === 1 ? 'pessoa' : 'pessoas'}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Horário</Label>
              <Select 
                value={formData.time} 
                onValueChange={(time) => setFormData(prev => ({ ...prev, time }))}
                disabled={!formData.date || !formData.guests}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {time}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      {formData.date && formData.guests ? 'Nenhum horário disponível' : 'Selecione data e número de pessoas'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Observações especiais (opcional)</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
              placeholder="Aniversário, preferências alimentares, etc."
              rows={3}
            />
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Valor da reserva:</strong> R$ {reservationPrice.toFixed(2)}
            </p>
          </div>

          <Button 
            type="button"
            onClick={handleProceedToPayment}
            className="w-full" 
            disabled={!formData.time}
          >
            Prosseguir para Pagamento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
