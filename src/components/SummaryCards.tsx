import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react';
import type { PortfolioSummary } from '../types';

interface Props {
  summary: PortfolioSummary;
}

function fmt(n: number, currency = true): string {
  return currency
    ? n.toLocaleString('ja-JP', { style: 'decimal', maximumFractionDigits: 0 })
    : n.toFixed(2);
}

export function SummaryCards({ summary }: Props) {
  const positive = summary.totalGainLoss >= 0;

  return (
    <div className="summary-cards">
      <div className="card">
        <div className="card-icon blue"><DollarSign size={20} /></div>
        <div>
          <div className="card-label">評価額</div>
          <div className="card-value">{fmt(summary.totalValue)}</div>
        </div>
      </div>
      <div className="card">
        <div className="card-icon gray"><BarChart2 size={20} /></div>
        <div>
          <div className="card-label">取得コスト</div>
          <div className="card-value">{fmt(summary.totalCost)}</div>
        </div>
      </div>
      <div className={`card ${positive ? 'gain' : 'loss'}`}>
        <div className={`card-icon ${positive ? 'green' : 'red'}`}>
          {positive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        </div>
        <div>
          <div className="card-label">損益</div>
          <div className={`card-value ${positive ? 'text-green' : 'text-red'}`}>
            {positive ? '+' : ''}{fmt(summary.totalGainLoss)}
          </div>
        </div>
      </div>
      <div className={`card ${positive ? 'gain' : 'loss'}`}>
        <div className={`card-icon ${positive ? 'green' : 'red'}`}>
          {positive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        </div>
        <div>
          <div className="card-label">損益率</div>
          <div className={`card-value ${positive ? 'text-green' : 'text-red'}`}>
            {positive ? '+' : ''}{fmt(summary.totalGainLossPercent, false)}%
          </div>
        </div>
      </div>
    </div>
  );
}
