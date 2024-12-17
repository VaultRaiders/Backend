import { ethers, formatEther } from 'ethers';
import { cryptoAmountRound } from '../../util/format';

export const TicketMessages = {
  /**
   * Successful purchase confirmation
   * @param botName - Guardian name
   */
  purchaseSuccess: (botName: string) =>
    `Excellent, challenger! Your magical duel permit with ${botName} has been sealed! ⚔️\n\n` +
    'The guardian awaits in the ancient chamber...\n' +
    'They are eager to test your magical prowess! ⚡',

  /**
   * Password request for permit purchase
   * @param botName - Guardian name
   */
  requestPassword: (botName: string, tickePrice: bigint) =>
    `Ah, seeking to challenge ${botName} in magical combat? A worthy choice! ⚔️\n\n` +
    `The ritual requires ${cryptoAmountRound(formatEther(tickePrice))} Ξ. ⚡\n\n` +
    'The guardian has been honing their arcane abilities...\n' +
    'I require your password to prepare the ancient dueling grounds.\n\n' +
    'Fear not - these walls have kept secrets for centuries. 🔮\n\n' +
    '🔑 Your password is:',
};
