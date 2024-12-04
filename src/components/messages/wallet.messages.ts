/**
 * Message templates for wallet management in the Vault Raider system.
 */
export const WalletMessages = {
  createNew: `Let us create your wallet, challenger! ⚔️

First, we must establish a powerful password.
This ancient magic will protect your artifacts and magical essence.

⚠️ Heed these warnings, challenger:
• Guard your password
• The wallet cannot be restored without it
• Share it with no one - not even the guardians themselves

🔑 Your password is:`,

  walletExists: `Challenger, you already possess a wallet! ⚡

One vault contains all the power you need - I personally maintain its protective wards.
Shall we inspect your current magical holdings instead? 🔮`,

  /**
   * Display vault information and balances
   * @param address - Vault address
   * @param soulBalance - Soul Essence balance
   * @param solBalance - ETH Crystal balance
   */
  walletInfo: (address: string, solBalance: string) =>
    `Welcome to your wallet, challenger! ⚔️

Your address:
<code>${address}</code>

ETH: <code>${solBalance} ETH</code>

What magical operations shall we perform today? ⚡`,

  noWallet: `Ah, you have yet to establish your wallet! 🔮

Fear not, challenger - I shall guide you through the ritual.
Here we shall safeguard your magical artifacts and power reserves.

Choose your path, and I shall guide you through the ancient ceremonies... ⚔️`,

  deleteConfirmation: `Are you certain you wish to dissolve your wallet, challenger? ⚠️

⚠️ Consider these grave consequences:
• This ritual cannot be undone
• All arcane seals will be lost to the void
• Your magical tributes will cease to flow

I must ensure you fully comprehend this momentous decision... 🔮`,

  deleteSuccess: `Your wallet has been dissolved as per your command... ⚡

Remember, challenger - you may always create a new wallet.
Shall I guide you through the creation of a new magical sanctum? ⚔️`,

  deleteCancelled: `Ah, you choose to maintain your wallet! A wise decision, challenger! 🔮

Your magical holdings remain secure.
Shall we continue exploring the ancient mysteries? ⚡`,

  /**
   * Successful vault creation confirmation
   * @param address - New vault address
   */
  createSuccess: (address: string) =>
    `Magnificent, challenger! Your wallet stands ready! ⚔️

Behold your unique address:
<code>${address}</code>

Guard this signature well - it is your key to accessing the ancient powers... ⚡`,

  /**
   * Private key information display
   * @param privateKey - Vault private key
   */
  privateKeyInfo: (privateKey: string) =>
    `And here is your wallet's private key, challenger... 🔮

<code>${privateKey}</code>

⚠️ Critical warnings:
• Store this magical essence in an impenetrable sanctuary
• Share it with no living soul
• Keep your password sealed with powerful wards

Now, shall we explore the ancient trials that await? ⚔️`,

  /**
   * Soul Essence purchase prompt
   * @param soulRate - Current Soul Essence exchange rate
   */
  buySoulPrompt: (soulRate: number) =>
    `Let us transmute your crystals into Soul Essence, challenger! ⚡

Current magical exchange: 1 ETH Crystal yields ${soulRate} Soul Essence

What quantity of Soul Essence do you seek?
Simply state the amount (e.g., "1000" for 1000 Soul Essence)... 🔮`,

  /**
   * Confirm Soul Essence purchase
   * @param soulAmount - Amount of Soul Essence to purchase
   * @param solAmount - ETH Crystal cost
   */
  confirmSoulPurchase: (soulAmount: number, solAmount: string) =>
    `A powerful choice, challenger! ⚔️

${soulAmount} Soul Essence requires ${solAmount} ETH Crystals

I require your password to perform this transmutation...

🔑 Your password is:`,

  walletRequired: `Challenger, a wallet is required for these ancient rituals.

Shall we forge one together? I shall ensure its wards are impenetrable... 🔮`,
};
