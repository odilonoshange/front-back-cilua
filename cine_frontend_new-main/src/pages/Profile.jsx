import { EmptyState } from '../ui/EmptyState';
import { User } from 'lucide-react';

export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <h1 className="text-3xl font-bold mb-8">O Meu Perfil</h1>
      <EmptyState 
        icon={User}
        title="Área Pessoal"
        description="Poderá gerir os seus dados, bilhetes e histórico aqui."
      />
    </div>
  );
}
