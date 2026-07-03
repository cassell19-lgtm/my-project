import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import type { StockWithQuote } from '../types';

interface Props {
  stocks: StockWithQuote[];
  onRemove: (id: string) => void;
}

function fmt(n: number, decimals = 0) {
  return n.toLocaleString('ja-JP', { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
}

export function StockTable({ stocks, onRemove }: Props) {
  if (stocks.length === 0) {
    return (
      <div className="empty-state">
        <p>保有銘柄がありません。「銘柄を追加」ボタンから株を追加してください。</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="stock-table">
        <thead>
          <tr>
            <th>銘柄</th>
            <th className="right">現在値</th>
            <th className="right">前日比</th>
            <th className="right">株数</th>
            <th className="right">取得単価</th>
            <th className="right">評価額</th>
            <th className="right">損益</th>
            <th className="right">損益率</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => {
            const pos = stock.gainLoss >= 0;
            const dayPos = (stock.quote?.change ?? 0) >= 0;
            return (
              <tr key={stock.id}>
                <td>
                  <div className="symbol">{stock.symbol}</div>
                  <div className="name">{stock.name}</div>
                </td>
                <td className="right mono">
                  {stock.quote ? fmt(stock.quote.price, 2) : '—'}
                </td>
                <td className={`right mono ${dayPos ? 'text-green' : 'text-red'}`}>
                  {stock.quote ? (
                    <span className="flex-end">
                      {dayPos ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {dayPos ? '+' : ''}{fmt(stock.quote.changePercent, 2)}%
                    </span>
                  ) : '—'}
                </td>
                <td className="right mono">{fmt(stock.shares, stock.shares % 1 !== 0 ? 3 : 0)}</td>
                <td className="right mono">{fmt(stock.purchasePrice, 2)}</td>
                <td className="right mono bold">{fmt(stock.currentValue)}</td>
                <td className={`right mono ${pos ? 'text-green' : 'text-red'}`}>
                  {pos ? '+' : ''}{fmt(stock.gainLoss)}
                </td>
                <td className={`right mono ${pos ? 'text-green' : 'text-red'}`}>
                  {pos ? '+' : ''}{fmt(stock.gainLossPercent, 2)}%
                </td>
                <td>
                  <button
                    className="icon-btn danger"
                    onClick={() => onRemove(stock.id)}
                    title="削除"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
