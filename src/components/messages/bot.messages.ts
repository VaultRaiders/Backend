/**
 * Message templates for bot interactions in the Vault Raider system.
 */
export const BotMessages = {
  botNotFound: "My apologies, but that guardian's magical signature cannot be traced. ⚠️\n" + 'Please try another guardian name.',

  noBotSelected:
    'Challenger, you have yet to select a guardian to face. Allow me to present our mighty guardians... Each wielding distinct magical powers. \n\n 🔮 Choose your opponent from the trials below. ⚔️',

  passwordRequest:
    'Ah, summoning a new guardian? Most intriguing! ⚡\n' +
    'To establish this magical connection, I require your arcane password.\n' +
    'Fear not, these ancient walls keep many secrets... 🔮\n' +
    '🔑 Your password is:',

  creationInProgress: 'One moment... The magical wards are aligning for your new guardian. ⚡',

  creationSuccess: (botName: string) =>
    `Excellent! The magical contract with ${botName} has been sealed. ⚔️\n` +
    'This guardian possesses formidable magical prowess.\n' +
    'Your dueling chamber awaits... Shall we begin the magical trial? 🔮',

  selectionSuccess: (botName: string) =>
    `A worthy choice! ${botName} is a most formidable guardian. ⚔️\n` +
    'The magical wards have been set for your confrontation.\n' +
    'The guardian stands ready... Begin when you dare! 🔮',

  noValidBots: 'I see no active magical contracts in your grimoire... ⚡\n' + 'Shall we arrange a trial against one of our skilled guardians? ⚔️',

  validBotsList: 'Behold the guardians who await your challenge! ⚡\n' + 'Choose wisely, for each possesses unique magical abilities... 🔮',

  noCreatedBots:
    'Your grimoire shows no guardian contracts yet... ⚡\n' +
    'Perhaps you wish to forge a contract with a new guardian?\n' +
    'Each can be attuned to specific magical challenges... ⚔️',

  createdBotsList:
    'Behold your contracted guardians! ⚡\n' +
    'Each mastering different schools of magic...\n' +
    'Select one to review their abilities or begin a duel! 🔮',

  explorePrompt:
    'Your chosen guardian awaits, challenger! ⚡\n' +
    'How shall you proceed?\n' +
    'Perhaps demonstrate your magical prowess or request to witness their spells... 🔮',

  showMenuHint: 'Cast /start to reveal the main grimoire',

  getRandomSuggestion: () => {
    const suggestions = [
      'Request to witness their signature spell',
      'Present your magical credentials',
      'Challenge their defensive capabilities',
      'Test their magical reflexes',
    ];

    return suggestions[Math.floor(Math.random() * suggestions.length)];
  },
};
