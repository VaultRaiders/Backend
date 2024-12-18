import { EMOJI, TERMS, createMessage } from './constant';

export const BotMessages = {
  botNotFound: `My apologies, but that ${TERMS.OPPONENT}'s magical signature cannot be traced. ${EMOJI.WARNING}\nPlease try another ${TERMS.OPPONENT} name.`,

  noBotSelected: `Challenger, you have yet to select a ${TERMS.OPPONENT} to face. Allow me to present our mighty guardians... Each wielding distinct magical powers. \n\n ${EMOJI.MYSTIC} Choose your opponent from the trials below. ${EMOJI.COMBAT}`,

  passwordRequest:
    `Ah, summoning a new ${TERMS.OPPONENT}? Most intriguing! ${EMOJI.MAGIC}\n` +
    'To establish this magical connection, I require your arcane password.\n' +
    `Fear not, these ancient walls keep many secrets... ${EMOJI.MYSTIC}\n` +
    `${EMOJI.KEY} Your password is:`,

  creationInProgress: `One moment... The magical wards are aligning for your new ${TERMS.OPPONENT}. ${EMOJI.MAGIC}`,
  
  botInactive: (botName: string) =>
    `Alas! ${botName} is currently dormant and cannot duel at this moment. ${EMOJI.SLEEPING}\n` +
    `It seems the magical energies have waned. Come back when ${botName} is ready to unleash its might! ${EMOJI.MYSTIC}`,

  creationSuccess: (botName: string) =>
    `Excellent! The magical contract with ${botName} has been sealed. ${EMOJI.COMBAT}\n` +
    `This ${TERMS.OPPONENT} possesses formidable magical prowess.\n` +
    `Your dueling chamber awaits... Shall we begin the ${TERMS.BATTLE}? ${EMOJI.MYSTIC}`,

  selectionSuccess: (botName: string) =>
    `A worthy choice! ${botName} is a most formidable ${TERMS.OPPONENT}. ${EMOJI.COMBAT}\n` +
    'The magical wards have been set for your confrontation.\n' +
    `The ${TERMS.OPPONENT} stands ready... Begin when you dare! ${EMOJI.MYSTIC}`,

  noValidBots:
    `I see no active magical contracts in your grimoire... ${EMOJI.MAGIC}\n` +
    `Shall we arrange a trial against one of our skilled guardians? ${EMOJI.COMBAT}`,

  validBotsList:
    `Behold the guardians who await your challenge! ${EMOJI.MAGIC}\n` +
    `Choose wisely, for each possesses unique magical abilities... ${EMOJI.MYSTIC}`,

  noCreatedBots:
    `Your grimoire shows no ${TERMS.OPPONENT} contracts yet... ${EMOJI.MAGIC}\n` +
    `Perhaps you wish to forge a contract with a new ${TERMS.OPPONENT}?\n` +
    'Each can be attuned to specific magical challenges... ${EMOJI.COMBAT}',

  createdBotsList:
    `Behold your contracted guardians! ${EMOJI.MAGIC}\n` +
    'Each mastering different schools of magic...\n' +
    `Select one to review their abilities or begin a ${TERMS.BATTLE}! ${EMOJI.MYSTIC}`,

  explorePrompt:
    `Your chosen ${TERMS.OPPONENT} awaits, challenger! ${EMOJI.MAGIC}\n` +
    'How shall you proceed?\n' +
    `Perhaps demonstrate your magical prowess or request to witness their spells... ${EMOJI.MYSTIC}`,

  showMenuHint: 'Cast /start to reveal the main grimoire',
};
