import { formatEther, parseEther } from 'ethers';
import { EMOJI, TERMS, MessageFormat, createMessage } from './constant';

export const WalletMessages = {
  createNew: createMessage({
    title: `Let us create your wallet, challenger! ${EMOJI.COMBAT}`,
    body: MessageFormat.formatWarnings([
      'Guard your password',
      'The wallet cannot be restored without it',
      'Share it with no one - not even the guardians themselves',
    ]),
    action: `${EMOJI.KEY} Your password is:`,
  }),

  walletExists: createMessage({
    title: `Challenger, you already possess a wallet!`,
    body: 'One vault contains all the power you need - I personally maintain its protective wards.',
    action: `Shall we inspect your current magical holdings instead? ${EMOJI.MYSTIC}`,
  }),

  walletInfo: (address: string, balance: bigint) =>
    createMessage({
      title: `Welcome to your wallet, challenger! ${EMOJI.COMBAT}`,
      body: `Your address:\n${MessageFormat.formatAddress(address)}\n\n${TERMS.CURRENCY_NAME}: ${MessageFormat.formatCurrency(balance)}`,
    }),

  noWallet: createMessage({
    title: `Ah, you have yet to establish your wallet! ${EMOJI.MYSTIC}`,
    body: 'Fear not, challenger - I shall guide you through the ritual.\nHere we shall safeguard your magical artifacts and power reserves.',
    action: `Choose your path, and I shall guide you through the ancient ceremonies... ${EMOJI.COMBAT}`,
  }),

  deleteConfirmation: createMessage({
    title: `${EMOJI.WARNING} Are you certain you wish to delete your wallet, challenger?`,
    body: MessageFormat.formatWarnings(['This action cannot be undone', 'All assets will lose control']),
    note: `I must ensure you fully comprehend this momentous decision...`,
  }),

  deleteSuccess: createMessage({
    title: `Your wallet has been deleted as per your command...`,
    body: 'Remember, challenger - you may always create a new wallet.',
    action: `Shall I guide you through the creation of a new magical sanctum? ${EMOJI.COMBAT}`,
  }),

  createSuccess: (address: string) =>
    createMessage({
      title: `Magnificent, challenger! Your wallet stands ready! ${EMOJI.COMBAT}`,
      body: `Behold your unique address:\n${MessageFormat.formatAddress(address)}`,
    }),

  privateKeyInfo: (privateKey: string) =>
    createMessage({
      title: `And here is your wallet's private key, challenger... ${EMOJI.MYSTIC}`,
      body: MessageFormat.formatAddress(privateKey),
      note: MessageFormat.formatWarnings([
        'Store this magical essence in an impenetrable sanctuary',
        'Share it with no living soul',
        'Keep your password sealed with powerful wards',
      ]),
      action: `Now, shall we explore the ancient trials that await? ${EMOJI.COMBAT}`,
    }),

  walletRequired: createMessage({
    title: `Challenger, a wallet is required for these ancient rituals.`,
    body: `Shall we forge one together? I shall ensure its wards are impenetrable... ${EMOJI.MYSTIC}`,
  }),

  lowBalance: (requiredAmount: bigint) =>
    createMessage({
      title: `${EMOJI.WARNING} Your magical reserves run low, brave challenger!`,
      body: `This enchantment requires ${MessageFormat.formatCurrency(requiredAmount)}`,
      action: 'Please replenish your crystal reserves to proceed.',
    }),

  transactionPending: createMessage({
    title: `${EMOJI.MAGIC} The ethereal winds carry your decree...`,
    body: 'Your transaction traverses the magical networks.',
    note: 'Please wait while the ancient ledgers record your actions.',
  }),

  transactionSuccess: createMessage({
    title: `${EMOJI.MAGIC} The ancient ledgers have recorded your decree!`,
    body: 'Your magical transaction is complete.',
    action: 'Your updated holdings will be visible momentarily.',
  }),

  transactionError: (error: string) =>
    createMessage({
      title: `${EMOJI.WARNING} A disturbance in the ethereal flow!`,
      body: `Your transaction encountered resistance: ${error}`,
      action: 'Please try your magical operation again.',
    }),
};
