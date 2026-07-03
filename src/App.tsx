import { useState } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { usePortfolio } from './hooks/usePortfolio';
import { AddStockModal } from './components/AddStockModal';
import { SummaryCards } from './components/SummaryCards';
import { PortfolioChart } from './components/PortfolioChart';
import { StockTable } from './components/StockTable';
import './App.css';

export default function App() {
  const { stocks, summary, loading, error, addStock, removeStock, refreshQuotes } = usePortfolio();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1>株式ポートフォリオ</h1>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={refreshQuotes}
              disabled={loading}
              title="株価を更新"
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              更新
            </button>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} />
              銘柄を追加
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {error && (
          <div className="alert">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <SummaryCards summary={summary} />

        <div className="content-grid">
          <div className="table-section">
            <h3>保有銘柄一覧</h3>
            <StockTable stocks={stocks} onRemove={removeStock} />
          </div>
          <PortfolioChart stocks={stocks} />
        </div>
      </main>

      {showModal && (
        <AddStockModal onAdd={addStock} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
