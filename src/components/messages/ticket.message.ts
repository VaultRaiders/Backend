import { EMOJI, TERMS, MessageFormat, createMessage } from './constant';

export const TicketMessages = {
  purchaseSuccess: (botName: string) =>
    createMessage({
      title: `${EMOJI.TICKET} Excellent! Your ticket with ${botName} has been actived!`,
      body: `${EMOJI.COMBAT} ${botName} is ready! You can send your message now. ${EMOJI.MYSTIC}`,
    }),

  requestPassword: (botName: string, ticketPrice: bigint) =>
    createMessage({
      title: `${EMOJI.TICKET} Buy ticket with ${botName}! ${EMOJI.TICKET}`,
      body:
        `💸 Ticket price: ${MessageFormat.formatCurrency(ticketPrice)}\n` +
        `⚠️ Please provide a password to proceed. I won't store your password anywhere, remember to keep it safe!`,
      action: `${EMOJI.KEY} Your password is:`,
    }),

  purchaseInProgress: (botName: string) =>
    createMessage({
      title: `${EMOJI.MAGIC} Preparing your ${TERMS.ACCESS}...`,
      body: `The ancient wards are aligning for your confrontation with ${botName}. ${EMOJI.MYSTIC}`,
    }),

  purchaseError: (error: string) =>
    createMessage({
      title: `${EMOJI.WARNING} A disturbance in the magical energies!`,
      body: `Your ${TERMS.ACCESS} ritual was disrupted: ${error}`,
      action: 'Please try the enchantment again.',
    }),

  ticketExpired: (botName: string) =>
    createMessage({
      title: `${EMOJI.WARNING} Your magical seal with ${botName} has weakened!`,
      body: `Your ${TERMS.ACCESS} has expired. Shall we forge a new one?`,
      action: 'Select "Purchase Permit" to establish a fresh magical connection.',
    }),

  ticketActive: (botName: string, expiryTime: string) =>
    createMessage({
      title: `${EMOJI.TICKET} Your ${TERMS.ACCESS} pulses with power!`,
      body: `You may challenge ${botName} until ${expiryTime}.\nThe ${TERMS.OPPONENT} awaits your challenge in the ${TERMS.LOCATION}. ${EMOJI.COMBAT}`,
    }),
};
