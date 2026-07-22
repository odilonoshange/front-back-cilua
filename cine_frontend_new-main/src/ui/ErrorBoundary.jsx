import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-text">
          <div className="container mx-auto px-4 py-16">
            <div className="rounded-3xl border border-white/10 bg-surface p-10 shadow-xl">
              <h1 className="text-3xl font-semibold">Algo deu errado</h1>
              <p className="mt-4 text-sm text-muted">Ocorreu um erro inesperado. Recarregue a página ou tente novamente mais tarde.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Recarregar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
