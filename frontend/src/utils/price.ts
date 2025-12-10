import { satsToBtc, formatSats, formatBtc } from '@shared/utils';

/**
 * Format price to display both BTC and Sats
 */
export function formatPriceDisplay(sats: number): { btc: string; sats: string; full: string } {
  const btc = satsToBtc(sats);
  return {
    btc: formatBtc(btc),
    sats: formatSats(sats),
    full: `${formatBtc(btc)} (${formatSats(sats)})`,
  };
}

/**
 * Format price for compact display (BTC with sats in parentheses)
 */
export function formatPriceCompact(sats: number): string {
  const btc = satsToBtc(sats);
  const btcFormatted = btc >= 1 
    ? btc.toFixed(8) 
    : btc.toFixed(8).replace(/\.?0+$/, '');
  const satsFormatted = formatSats(sats);
  return `${btcFormatted} BTC (${satsFormatted})`;
}

/**
 * Format price for card display (shows both prominently)
 */
export function formatPriceCard(sats: number): { primary: string; secondary: string } {
  const btc = satsToBtc(sats);
  return {
    primary: btc >= 0.001 ? `${btc.toFixed(8)} BTC` : formatSats(sats),
    secondary: btc >= 0.001 ? formatSats(sats) : `${btc.toFixed(8)} BTC`,
  };
}

