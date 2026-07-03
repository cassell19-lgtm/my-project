import type { StockQuote } from '../types';

// Uses Yahoo Finance unofficial API via a CORS proxy
const PROXY = 'https://query1.finance.yahoo.com/v8/finance/chart/';

async function fetchQuoteFromYahoo(symbol: string): Promise<StockQuote | null> {
  try {
    const res = await fetch(`${PROXY}${symbol}?interval=1d&range=1d`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price = meta.regularMarketPrice ?? 0;
    const prev = meta.previousClose ?? meta.chartPreviousClose ?? price;
    const change = price - prev;
    return {
      symbol: symbol.toUpperCase(),
      price,
      change,
      changePercent: prev ? (change / prev) * 100 : 0,
      previousClose: prev,
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

// Simple in-memory cache to avoid hammering the API
const cache = new Map<string, { quote: StockQuote; ts: number }>();
const CACHE_TTL = 60_000; // 1 minute

export async function getQuote(symbol: string): Promise<StockQuote | null> {
  const cached = cache.get(symbol);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.quote;

  const quote = await fetchQuoteFromYahoo(symbol);
  if (quote) cache.set(symbol, { quote, ts: Date.now() });
  return quote;
}

export async function getQuotes(symbols: string[]): Promise<Map<string, StockQuote>> {
  const results = await Promise.all(symbols.map(s => getQuote(s).then(q => [s, q] as const)));
  const map = new Map<string, StockQuote>();
  for (const [s, q] of results) if (q) map.set(s, q);
  return map;
}
