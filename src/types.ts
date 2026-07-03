export interface Stock {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  lastUpdated: string;
}

export interface StockWithQuote extends Stock {
  quote?: StockQuote;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface PortfolioSummary {
  totalCost: number;
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}
