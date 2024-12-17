import { formatEther } from 'ethers';
import { cryptoAmountRound } from '../../util/format';

export const EMOJI = {
  COMBAT: '⚔️', // For challenges, duels, battles
  MAGIC: '⚡', // For magical operations, power
  MYSTIC: '🔮', // For predictions, mystical elements
  WARNING: '⚠️', // For important warnings
  KEY: '🔑', // For passwords, security
  TICKET: '🎟️', // For permits, access
} as const;

export const TERMS = {
  OPPONENT: 'guardian',
  BATTLE: 'magical trial',
  ACCESS: 'duel permit',
  LOCATION: 'ancient chamber',
  CURRENCY_SYMBOL: 'Ξ', // Unicode ETH symbol
  CURRENCY_NAME: 'ETH', // Text representation
} as const;

export const MessageFormat = {
  formatCurrency: (amount: bigint, useSymbol = true) => {
    const value = cryptoAmountRound(formatEther(amount));
    return `<code>${value} ${useSymbol ? TERMS.CURRENCY_SYMBOL : TERMS.CURRENCY_NAME}</code>`;
  },

  formatAddress: (address: string) => {
    return `<code>${address}</code>`;
  },

  formatWarnings: (warnings: string[]) => {
    const bulletPoints = warnings.map((warning) => `• ${warning}`).join('\n');
    return `${EMOJI.WARNING} Heed these warnings, challenger:\n${bulletPoints}`;
  },

  formatAction: (action: string, emoji = EMOJI.MAGIC) => {
    return `${emoji} ${action}`;
  },
} as const;

export interface MessageTemplate {
  title: string;
  body: string;
  action?: string;
  note?: string;
}

export const createMessage = (template: MessageTemplate): string => {
  let message = `${template.title}\n\n${template.body}`;

  if (template.action) {
    message += `\n\n${MessageFormat.formatAction(template.action)}`;
  }

  if (template.note) {
    message += `\n\n${template.note}`;
  }

  return message;
};
