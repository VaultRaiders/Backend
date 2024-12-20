import { toBigInt } from 'ethers';
import { IBotResponse } from '../../types/responses/bot.response';
import { EMOJI, TERMS, MessageFormat, createMessage } from './constant';

export const MainMessages = {
  welcomeNew: (username: string) => {
    return createMessage({
      title: `Welcome, brave soul! I am Master Grimclaw, Chief Security Officer of the Ancient Vaults. ${username}, I see you seek to test your magical prowess against our vault guardians.`,
      body: 'Before you face our challenges, we must establish your magical signature...\n\nFirst, we shall create your secure wallet',
      action: 'Simply tap "Create Wallet" below, and I shall guide you through the ancient rituals.',
    });
  },

  welcomeActiveBot: (username: string, bot: IBotResponse) => {
    const title = `Ah, ${username}! The magical wards show you've crossed paths with ${bot.displayName}. The ${TERMS.OPPONENT} awaits your return... ${EMOJI.COMBAT}`;

    let body = `${EMOJI.AWARD} Award: ${MessageFormat.formatCurrency(toBigInt(bot.balance))}\n`;

    if (bot.hasActiveTicket) {
      body += `\nThe ${TERMS.OPPONENT} stands ready in the ${TERMS.LOCATION}. Prepare your spells wisely...`;
    } else {
      body +=
        `${EMOJI.TICKET} ${TERMS.ACCESS}: ${MessageFormat.formatCurrency(toBigInt(bot.ticketPrice))}\n\n` +
        `Shall we arrange another ${TERMS.BATTLE} with ${bot.displayName}?\n\n` +
        `Acquire a ${TERMS.ACCESS} to continue this magical challenge! ${EMOJI.COMBAT}`;
    }

    return createMessage({ title, body });
  },

  welcomeBack: (username: string) => {
    return createMessage({
      title: `Welcome back to the Ancient Vaults, ${username}!`,
      body: `Our magical wards sensed your approach. The ${TERMS.OPPONENT}s stand ready to test your abilities.\n\nEach ${TERMS.OPPONENT} possesses unique magical talents. Choose your opponent wisely...`,
    });
  },
};
