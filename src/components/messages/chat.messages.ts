/**
 * Message templates for chat interactions in the Vault Raider system.
 */
export const ChatMessages = {
  profileNotFound: 'By the ancient vaults! Your magical signature seems to have faded. Let us restore it at once... ⚡',

  chatCreationError: 'My apologies, the magical wards are unstable. Grant me a moment to stabilize the dueling chamber... ⚡',

  chooseBotPrompt:
    'Behold our collection of ancient guardians... Each has mastered different schools of magic, presenting unique challenges. Choose wisely - matching against the right guardian is crucial for your trials... ⚔️',

  startChatPrompt:
    'Before your magical trial begins, we must select a suitable guardian for your challenge. Review their magical specialties, and indicate which guardian you wish to face. ⚡ 👇 Access the Trials Registry below',

  subscriptionRequired: (botName: string) =>
    `Ah, ${botName} stands ready for battle, but I notice you lack a valid duel permit. ⚔️\n` +
    'The guardian has been practicing powerful new spells... Acquire a permit, and I shall arrange your magical confrontation... 🔮',

  subscriptionExpired: (botName: string) =>
    `Your duel permit for challenging ${botName} has expired... ⚡\n` +
    'The guardian has grown stronger since your last encounter. Shall we arrange another trial? Acquire a new permit to continue testing your magical prowess... ⚔️',

  messageError: 'A magical disruption has occurred. Allow me to stabilize the wards - we must maintain perfect magical harmony... ⚡',

  noResponse: 'The guardian appears to be charging their magical energy. Shall we reset the magical field? They await your next move... ⚔️',
};
