/**
 * Message templates for error handling in the Vault Raider system.
 */
export const ErrorMessages = {
  profileMixup: 'By the ancient vaults! Your magical signature appears distorted.\nLet me realign the arcane energies... ⚡',

  connectionIssue: 'Challenger, the magical wards are fluctuating.\nAllow me to stabilize the connection... 🔮',

  processingError: (error: string) =>
    `Alert! A magical disturbance has occurred:\n${error}\n\nFear not, challenger. Such arcane anomalies are not uncommon...`,

  passwordProcess: 'By the ancient laws! The password ritual has been disrupted.\nLet us begin anew - the magical seals must be perfect... ⚡',
};
