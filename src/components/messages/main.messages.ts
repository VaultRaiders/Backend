import { toBigInt } from 'ethers';
import { IBotResponse } from '../../types/responses/bot.response';
import { EMOJI, TERMS, MessageFormat, createMessage } from './constant';

export const MainMessages = {
  welcomeNew: (username: string) => {
    return createMessage({
      title: `🎉 Welcome, brave soul! I am Master Grimclaw, Chief Security Officer of the ${TERMS.LOCATION}. ${username}, I see you seek to test your magical prowess against our vault guardians.`,
      body: `1️⃣ First, we shall create your wallet ${EMOJI.WALLET}.`,
      action: 'Simply tap "Create Wallet" below, and I shall guide you through the ancient rituals.',
    });
  },

  welcomeActiveBot: (username: string, bot: IBotResponse) => {
    const title = `${EMOJI.COMBAT} ${bot.displayName} is ready. Let's battle! ${EMOJI.COMBAT}`;

    let body = `${EMOJI.AWARD} Award: ${MessageFormat.formatCurrency(toBigInt(bot.balance))}\n`;

    if (bot.hasActiveTicket) {
      body += `\nSend your message now 👇.`;
    } else {
      body +=
        `${EMOJI.TICKET} ${TERMS.ACCESS}: ${MessageFormat.formatCurrency(toBigInt(bot.ticketPrice))}\n\n` +
        `Looks like you don't have a ticket or your ticket has expired, buy one and let's battle right away!`;
    }

    return createMessage({ title, body });
  },

  welcomeBack: (username: string) => {
    return createMessage({
      title: `Welcome back to the ${TERMS.LOCATION}, ${username}!`,
      body: `Our magical wards sensed your approach. The ${TERMS.OPPONENT}s stand ready to test your abilities.\n\nEach ${TERMS.OPPONENT} possesses unique magical talents. Choose your opponent wisely...`,
    });
  },
};
