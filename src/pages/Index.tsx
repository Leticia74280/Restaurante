
import { ReservationForm } from '../components/ReservationForm';
import { Navbar } from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, MapPin } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Reserve Sua Mesa no
              <span className="text-orange-500 block">Gourmet Experience</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Desfrute de uma experiência gastronômica única em nosso restaurante. 
              Reserve sua mesa com facilidade e garanta momentos inesquecíveis.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center gap-2 text-gray-700">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>4.9★ Avaliação</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-orange-500" />
                <span>18:00 - 23:00</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-orange-500" />
                <span>Até 8 pessoas</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span>Centro, São Paulo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Faça Sua Reserva
            </h2>
            <p className="text-gray-600">
              Reserve sua mesa em poucos cliques e receba confirmação por e-mail
            </p>
          </div>
          <ReservationForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o Gourmet Experience?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Culinária Excepcional</h3>
              <p className="text-gray-600">
                Pratos preparados com ingredientes selecionados pelos nossos chefs renomados
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ambiente Acolhedor</h3>
              <p className="text-gray-600">
                Espaço elegante e confortável, perfeito para encontros especiais
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reserva Fácil</h3>
              <p className="text-gray-600">
                Sistema de reservas online simples e confirmação instantânea
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Não tem uma conta ainda?
          </h2>
          <p className="text-white/90 mb-8">
            Crie sua conta para gerenciar suas reservas e receber ofertas exclusivas
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
