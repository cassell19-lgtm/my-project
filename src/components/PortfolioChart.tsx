import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { StockWithQuote } from '../types';

const COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16'];

interface Props {
  stocks: StockWithQuote[];
}

export function PortfolioChart({ stocks }: Props) {
  if (stocks.length === 0) return null;

  const data = stocks.map(s => ({
    name: s.symbol,
    value: Math.max(s.currentValue, 0),
  })).filter(d => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: Record<string, number>) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const pct = total > 0 ? ((data[index].value / total) * 100).toFixed(1) : '0';
    if (parseFloat(pct) < 5) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
        {pct}%
      </text>
    );
  };

  return (
    <div className="chart-container">
      <h3>ポートフォリオ構成</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            labelLine={false}
            label={renderLabel as never}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => [Number(v).toLocaleString('ja-JP', { maximumFractionDigits: 0 }), '評価額']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
