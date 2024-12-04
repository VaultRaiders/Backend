export const MainMessages = {
  /**
   * Welcome message for new users
   * @param username - The username of the new vault raider
   * @param socialLinks - Social media links for the platform
   */
  welcomeNew: (username: string, socialLinks: string) =>
    `Welcome, brave soul! I am Master Grimclaw, Chief Security Officer of the Ancient Vaults. ${username}, I see you seek to test your magical prowess against our vault guardians.\n\n` +
    'Before you face our challenges, we must establish your magical signature...\n\n' +
    'First, we shall create your secure wallet\n\n' +
    'Simply tap "Create Wallet" below, and I shall guide you through the ancient rituals. ⚡\n\n' +
    `${socialLinks}`,

  /**
   * Welcome back message for users with active guardian encounters
   * @param username - The username of the vault raider
   * @param botName - The name of the vault guardian
   * @param subscription - Subscription details for active encounters
   * @param socialLinks - Social media links
   */
  welcomeActiveBot: (username: string, botName: string, subscription: any, socialLinks: string) => {
    let message = `Ah, ${username}! The magical wards show you've crossed paths with ${botName}. The guardian awaits your return... ⚔️\n\n`;

    if (subscription && subscription !== true) {
      const formattedDate = subscription.expiresAt.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      message +=
        `Your magical duel permit remains active until ${formattedDate}.\n\n` +
        'The guardian stands ready in the chamber. Prepare your spells wisely...\n';
    } else {
      message +=
        `Shall we arrange another magical confrontation with ${botName}?\n\n` +
        'The guardian has been honing their skills since your last encounter... 🔮\n\n' +
        'Acquire a duel permit to continue this magical challenge! ⚔️\n\n';
    }

    return `${message}\n${socialLinks}`;
  },

  /**
   * Standard welcome back message
   * @param username - The username of the vault raider
   * @param socialLinks - Social media links
   */
  welcomeBack: (username: string, socialLinks: string) =>
    `Welcome back to the Ancient Vaults, ${username}! ⚡\n\n` +
    'Our magical wards sensed your approach. The vault guardians stand ready to test your abilities.\n\n' +
    'Each guardian possesses unique magical talents. Choose your opponent wisely...\n\n' +
    `${socialLinks}`,
};
