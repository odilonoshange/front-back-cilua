import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-2 font-display text-7xl font-bold text-primary">404</h1>
      <h2 className="mb-6 text-2xl font-semibold">Página não encontrada</h2>
      <p className="mb-8 max-w-md text-muted">
        A página que tentou acessar não existe ou foi movida.
      </p>
      <Link to="/">
        <Button>Voltar ao Início</Button>
      </Link>
    </div>
  );
}
