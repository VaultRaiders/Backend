import { EMOJI, TERMS, createMessage } from './constant';

export const ChatMessages = {
  profileNotFound: createMessage({
    title: `By the ancient vaults! Your magical signature seems to have faded. ${EMOJI.MAGIC}`,
    body: 'Let us restore it at once...',
  }),

  chatCreationError: createMessage({
    title: 'My apologies, the magical wards are unstable.',
    body: `Grant me a moment to stabilize the ${TERMS.LOCATION}... ${EMOJI.MAGIC}`,
  }),

  chooseBotPrompt: createMessage({
    title: 'Behold our collection of ancient guardians...',
    body: `Each has mastered different schools of magic, presenting unique challenges. Choose wisely - matching against the right ${TERMS.OPPONENT} is crucial for your trials... ${EMOJI.COMBAT}`,
  }),

  startChatPrompt: createMessage({
    title: `Before your ${TERMS.BATTLE} begins, we must select a suitable ${TERMS.OPPONENT} for your challenge. ${EMOJI.MAGIC}`,
    body: `Review their magical specialties, and indicate which ${TERMS.OPPONENT} you wish to face.`,
    action: '👇 Access the Trials Registry below',
  }),

  subscriptionRequired: (botName: string) =>
    createMessage({
      title: `Ah, ${botName} stands ready for battle, but I notice you lack a valid ${TERMS.ACCESS}. ${EMOJI.COMBAT}`,
      body: `The ${TERMS.OPPONENT} has been practicing powerful new spells... Acquire a permit, and I shall arrange your magical confrontation... ${EMOJI.MYSTIC}`,
    }),

  subscriptionExpired: (botName: string) =>
    createMessage({
      title: `Your ${TERMS.ACCESS} for challenging ${botName} has expired... ${EMOJI.MAGIC}`,
      body: `The ${TERMS.OPPONENT} has grown stronger since your last encounter. Shall we arrange another trial?\n\nAcquire a new permit to continue testing your magical prowess... ${EMOJI.COMBAT}`,
    }),

  messageError: createMessage({
    title: 'A magical disruption has occurred.',
    body: `Allow me to stabilize the wards - we must maintain perfect magical harmony... ${EMOJI.MAGIC}`,
  }),

  noResponse: createMessage({
    title: `The ${TERMS.OPPONENT} appears to be charging their magical energy.`,
    body: `Shall we reset the magical field? They await your next move... ${EMOJI.COMBAT}`,
  }),
};
