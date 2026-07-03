import { useState, useEffect, useCallback } from 'react';
import type { Stock, StockWithQuote, PortfolioSummary } from '../types';
import { getQuotes } from '../utils/stockApi';

const STORAGE_KEY = 'stock-portfolio';

function loadStocks(): Stock[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveStocks(stocks: Stock[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
}

export function usePortfolio() {
  const [stocks, setStocks] = useState<Stock[]>(loadStocks);
  const [quotes, setQuotes] = useState<Map<string, import('../types').StockQuote>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshQuotes = useCallback(async (stockList: Stock[]) => {
    if (stockList.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const symbols = [...new Set(stockList.map(s => s.symbol))];
      const q = await getQuotes(symbols);
      setQuotes(q);
      if (q.size === 0) setError('株価の取得に失敗しました。ネットワークを確認してください。');
    } catch {
      setError('株価の取得中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshQuotes(stocks);
  }, [stocks, refreshQuotes]);

  const addStock = useCallback((stock: Omit<Stock, 'id'>) => {
    const newStock: Stock = { ...stock, id: crypto.randomUUID() };
    setStocks(prev => {
      const updated = [...prev, newStock];
      saveStocks(updated);
      return updated;
    });
  }, []);

  const removeStock = useCallback((id: string) => {
    setStocks(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveStocks(updated);
      return updated;
    });
  }, []);

  const stocksWithQuotes: StockWithQuote[] = stocks.map(stock => {
    const quote = quotes.get(stock.symbol);
    const currentPrice = quote?.price ?? stock.purchasePrice;
    const currentValue = currentPrice * stock.shares;
    const costBasis = stock.purchasePrice * stock.shares;
    const gainLoss = currentValue - costBasis;
    const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
    return { ...stock, quote, currentValue, gainLoss, gainLossPercent };
  });

  const summary: PortfolioSummary = stocksWithQuotes.reduce(
    (acc, s) => {
      const cost = s.purchasePrice * s.shares;
      acc.totalCost += cost;
      acc.totalValue += s.currentValue;
      acc.totalGainLoss += s.gainLoss;
      return acc;
    },
    { totalCost: 0, totalValue: 0, totalGainLoss: 0, totalGainLossPercent: 0 }
  );
  if (summary.totalCost > 0) {
    summary.totalGainLossPercent = (summary.totalGainLoss / summary.totalCost) * 100;
  }

  return { stocks: stocksWithQuotes, summary, loading, error, addStock, removeStock, refreshQuotes: () => refreshQuotes(stocks) };
}
