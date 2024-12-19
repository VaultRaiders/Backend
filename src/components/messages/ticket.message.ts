import { EMOJI, TERMS, MessageFormat, createMessage } from './constant';

export const TicketMessages = {
  purchaseSuccess: (botName: string) =>
    createMessage({
      title: `${EMOJI.TICKET} Excellent, challenger! Your ${TERMS.ACCESS} with ${botName} has been sealed! ${EMOJI.COMBAT}`,
      body: `The ${TERMS.OPPONENT} awaits in the ${TERMS.LOCATION}...\nThey are eager to test your magical prowess!`,
    }),

  requestPassword: (botName: string, ticketPrice: bigint) =>
    createMessage({
      title: `Ah, seeking to challenge ${botName} in ${TERMS.BATTLE}? A worthy choice! ${EMOJI.COMBAT}`,
      body: `The ritual requires ${MessageFormat.formatCurrency(ticketPrice)}. \n\nThe ${
        TERMS.OPPONENT
      } has been honing their arcane abilities...\nI require your password to prepare the ancient dueling grounds.`,
      note: `Fear not - these walls have kept secrets for centuries. ${EMOJI.MYSTIC}`,
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
