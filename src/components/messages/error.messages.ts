import { EMOJI, TERMS, createMessage } from './constant';

export const ErrorMessages = {
  profileMixup: createMessage({
    title: `${EMOJI.WARNING} By the ancient vaults! Your magical signature appears distorted.`,
    body: `Let me realign the arcane energies... ${EMOJI.MAGIC}`,
  }),

  connectionIssue: createMessage({
    title: `${EMOJI.WARNING} Challenger, the magical wards are fluctuating.`,
    body: `Allow me to stabilize the connection... ${EMOJI.MYSTIC}`,
  }),

  processingError: (error: string) =>
    createMessage({
      title: `${EMOJI.WARNING} Alert! A magical disturbance has occurred:`,
      body: error,
      note: `Fear not, challenger. Such arcane anomalies are not uncommon... ${EMOJI.MAGIC}`,
    }),

  passwordProcess: createMessage({
    title: `${EMOJI.WARNING} By the ancient laws! The password ritual has been disrupted.`,
    body: `Let us begin anew - the magical seals must be perfect... ${EMOJI.MAGIC}`,
  }),

  insufficientFunds: createMessage({
    title: `${EMOJI.WARNING} Your crystal reserves run low, brave challenger!`,
    body: `The required magical tribute cannot be drawn from your vault... ${EMOJI.MAGIC}`,
    note: `You'll need more ${TERMS.CURRENCY_SYMBOL} to proceed with this enchantment.`,
  }),

  networkError: createMessage({
    title: `${EMOJI.WARNING} The ethereal networks are unstable!`,
    body: `Our magical pathways are experiencing interference... ${EMOJI.MAGIC}`,
    action: 'Please try your enchantment again in a few moments.',
  }),

  validationError: (field: string) =>
    createMessage({
      title: `${EMOJI.WARNING} The magical runes are improperly aligned!`,
      body: `The ${field} requires your attention... ${EMOJI.MAGIC}`,
      action: 'Please review and adjust your magical inscription.',
    }),

  timeoutError: createMessage({
    title: `${EMOJI.WARNING} The magical resonance has faded!`,
    body: `Our connection to the ethereal plane has weakened... ${EMOJI.MAGIC}`,
    action: 'Please recast your enchantment.',
  }),
};
