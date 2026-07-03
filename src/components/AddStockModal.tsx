import { useState } from 'react';
import { X } from 'lucide-react';
import type { Stock } from '../types';

interface Props {
  onAdd: (stock: Omit<Stock, 'id'>) => void;
  onClose: () => void;
}

export function AddStockModal({ onAdd, onClose }: Props) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !shares || !purchasePrice) return;
    onAdd({
      symbol: symbol.toUpperCase().trim(),
      name: name.trim() || symbol.toUpperCase().trim(),
      shares: parseFloat(shares),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>銘柄を追加</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ティッカーシンボル *</label>
            <input
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              placeholder="例: AAPL, 7203.T"
              required
            />
            <span className="hint">日本株は「7203.T」のように末尾に .T を付けてください</span>
          </div>
          <div className="form-group">
            <label>銘柄名</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例: Apple Inc."
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>株数 *</label>
              <input
                type="number"
                value={shares}
                onChange={e => setShares(e.target.value)}
                placeholder="100"
                min="0.001"
                step="any"
                required
              />
            </div>
            <div className="form-group">
              <label>取得単価 *</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={e => setPurchasePrice(e.target.value)}
                placeholder="150.00"
                min="0"
                step="any"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>取得日</label>
            <input
              type="date"
              value={purchaseDate}
              onChange={e => setPurchaseDate(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>キャンセル</button>
            <button type="submit" className="btn btn-primary">追加</button>
          </div>
        </form>
      </div>
    </div>
  );
}
