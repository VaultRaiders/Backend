/**
 * Message templates for duel permit management in the Vault Raider system.
 */
export const TicketMessages = {
  /**
   * Display purchase options for duel permits
   * @param botName - Guardian name
   * @param soulPrice - Price in Soul tokens
   * @param solPrice - Price in ETH
   * @param soulBalance - User's Soul token balance
   */
  purchaseOptions: (botName: string, soulPrice: number, solPrice: number, soulBalance: number) =>
    `Let us prepare your magical duel permit for ${botName}, challenger! ⚔️\n\n` +
    'Choose your method of tribute:\n' +
    `⚡ Soul Essence Cost: <code>${soulPrice} $Soul</code>\n` +
    `🔮 ETH Crystal Cost: <code>${solPrice} ETH</code>\n\n` +
    `Your Soul Essence Reserve: ${soulBalance} $Soul. 🎁 More potent and free of arcane transmission fees with Soul Essence.\n\n` +
    'Need more Soul Essence? Invoke the "Acquire Soul Essence" ritual below! ⚡',

  /**
   * Insufficient Soul tokens message
   * @param required - Required amount of Soul tokens
   * @param current - Current balance of Soul tokens
   */
  insufficientSoul: (required: number, current: number) =>
    'Challenger, your Soul Essence reserves are too low...\n\n' +
    `The ritual requires ${required} Soul Essence, but you possess only ${current}.\n\n` +
    'Shall we perform the Soul Essence acquisition ritual? 🔮',

  /**
   * Successful purchase confirmation
   * @param botName - Guardian name
   */
  purchaseSuccess: (botName: string) =>
    `Excellent, challenger! Your magical duel permit with ${botName} has been sealed! ⚔️\n\n` +
    'The guardian awaits in the ancient chamber...\n' +
    'They are eager to test your magical prowess! ⚡',

  /**
   * Password request for permit purchase
   * @param botName - Guardian name
   */
  requestPassword: (botName: string) =>
    `Ah, seeking to challenge ${botName} in magical combat? A worthy choice! ⚔️\n\n` +
    'The guardian has been honing their arcane abilities...\n' +
    'I require your password to prepare the ancient dueling grounds.\n\n' +
    'Fear not - these walls have kept secrets for centuries. 🔮\n\n' +
    '🔑 Your password is:',
};
