import { formatEther } from 'ethers';
import { cryptoAmountRound } from '../../util/format';

export const MainMessages = {
  welcomeNew: (username: string) => {
    return (
      `Welcome, brave soul! I am Master Grimclaw, Chief Security Officer of the Ancient Vaults. ${username}, I see you seek to test your magical prowess against our vault guardians.\n\n` +
      'Before you face our challenges, we must establish your magical signature...\n\n' +
      'First, we shall create your secure wallet\n\n' +
      'Simply tap "Create Wallet" below, and I shall guide you through the ancient rituals. ⚡\n\n'
    );
  },

  welcomeActiveBot: (username: string, botName: string, ticketPrice: bigint, currentAward: bigint, hasTicket: boolean) => {
    let message = `Ah, ${username}! The magical wards show you've crossed paths with ${botName}. The guardian awaits your return... ⚔️\n\n`;
    message += `⚡ Award: <code>${cryptoAmountRound(formatEther(currentAward))} ETH</code>\n`;
    if (hasTicket) {
      message += '\nThe guardian stands ready in the chamber. Prepare your spells wisely...\n';
    } else {
      message +=
        `🎟️ Ticket Price: <code>${cryptoAmountRound(formatEther(ticketPrice))} ETH</code>\n\n` +
        `Shall we arrange another magical confrontation with ${botName}?\n\n` +
        'Acquire a duel permit to continue this magical challenge! ⚔️\n\n';
    }

    return `${message}`;
  },

  welcomeBack: (username: string) => {
    return (
      `Welcome back to the Ancient Vaults, ${username}! ⚡\n\n` +
      'Our magical wards sensed your approach. The vault guardians stand ready to test your abilities.\n\n' +
      'Each guardian possesses unique magical talents. Choose your opponent wisely...\n'
    );
  },
};
