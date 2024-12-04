import { formatEther } from 'ethers';

/**
 * Message templates for investment interactions in the Vault Raider system.
 */
export const InvestMessages = {
  noActiveBotSelected: `Challenger, there seems to be an anomaly in your magical signature.
Let me restore the proper resonance... ⚡`,

  dashboard: (botName: string, stats: any) =>
    `Welcome to ${botName}'s Arcane Treasury, challenger! ⚔️\n\n` +
    'Behold your magical investments and guardian statistics:\n\n' +
    `⚡ Available Rewards: <code>${formatEther(stats.revenue)} ETH</code>\n` +
    `🔮 Your Arcane Seals: <code>${stats.myBalance}</code>\n` +
    `✨ Total Seals in Circulation: <code>${stats.circulatingSupply}</code>\n\n` +
    '📊 Guardian Power Metrics:\n' +
    `└ Total Magic Generated: <code>${formatEther(stats.totalRevenue)} ETH</code>\n` +
    `└ Total Duels: <code>${stats.chatCount}</code>\n` +
    `└ Spells Cast: <code>${stats.messageCount}</code>\n` +
    `└ Magic Artifacts Created: <code>${stats.photoCount}</code>\n` +
    `└ Active Challengers: <code>${stats.activeSubscribers}</code>\n\n` +
    `Did you know? Holding ${botName}'s arcane seals grants you power whenever someone challenges them!\n` +
    'Like being a patron of ancient magic... Fascinating, is it not? ⚡',

  buyKeyConfirmation: (botName: string, keyPrice: bigint, keyPriceWithFee: bigint) =>
    `Interested in becoming a patron of ${botName}'s ancient magic? Most wise! ⚔️\n\n` +
    'Here are the terms of the magical contract:\n\n' +
    `⚡ Seal Price: <code>${formatEther(keyPrice)} ETH</code>\n` +
    `✨ Arcane Tax: <code>${formatEther(keyPriceWithFee - keyPrice)} ETH</code>\n` +
    `🔮 Total Investment: <code>${formatEther(keyPriceWithFee)} ETH</code>\n\n` +
    `As a seal bearer, you shall receive magical tribute whenever ${botName} is challenged.\n` +
    'A most prestigious arrangement... Shall we proceed with the ritual? ⚔️',

  sellKeyConfirmation: (botName: string, keyPrice: bigint, keyPriceWithFee: bigint) =>
    `Considering relinquishing ${botName}'s arcane seal? 🔮\n\n` +
    'Behold the terms of dissolution:\n\n' +
    `⚡ Current Value: <code>${formatEther(keyPrice)} ETH</code>\n` +
    `✨ Arcane Tax: <code>${formatEther(keyPrice - keyPriceWithFee)} ETH</code>\n` +
    `🔮 Your Receipt: <code>${formatEther(keyPriceWithFee)} ETH</code>\n\n` +
    `Remember, challenger - selling means forsaking tribute from ${botName}'s duels...\n` +
    'Are you certain of this decision? ⚔️',

  noKeysToSell: (botName: string) =>
    `Ah, you possess no arcane seals of ${botName} yet.\n\n` +
    'Perhaps you would prefer to become their magical patron instead?\n' +
    'The rewards can be... most powerful. ⚡',

  noActiveTrade: `Apologies, challenger, but I cannot locate your pending magical transaction.
Shall we begin a fresh ritual? 🔮`,

  enterPasswordBuy: 'An excellent choice! ⚔️\n\n' + 'Present your password, and I shall forge your arcane seal...\n\n' + '🔑 Your password is:',

  enterPasswordSell: 'If you are resolute... 🔮\n\n' + 'Provide your password to dissolve the seal...\n\n' + '🔑 Your password is:',

  enterPasswordWithdraw:
    'Ready to claim your magical tribute? Most excellent! ⚡\n\n' +
    'Present your password, and I shall transfer your earned power immediately...\n' +
    'It brings me joy to see our patrons realize their investments! ⚔️\n\n' +
    '🔑 Your password is:',

  buyKeySuccess: (botName: string) =>
    `Congratulations, mighty one! ⚔️\n\n` +
    `You now hold an arcane seal of ${botName}!\n` +
    'You shall receive tribute whenever they face a challenger...\n\n' +
    'Care to check your magical earnings? Simply invoke "Collect Tribute" at your leisure! ⚡',

  sellKeySuccess: (botName: string) =>
    `The magical contract has been dissolved... 🔮\n\n` +
    `Though it pains me to see you part with ${botName}'s seal,\n` +
    'know that you may always seek patronage again! ⚔️',

  withdrawSuccess: (botName: string) =>
    `Splendid news, challenger! ⚡\n\n` +
    'Your magical tribute has been transferred.\n' +
    `Being ${botName}'s patron has its privileges, does it not?\n\n` +
    'Remember - more seals means greater power! ⚔️',

  tradeCancelled: `Changed your mind? Fear not, challenger... ⚡

Take time to consider your magical investments. I remain here to guide you through our arcane opportunities. 🔮`,
};
