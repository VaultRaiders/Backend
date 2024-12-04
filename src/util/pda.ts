import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export function getBotPDA(factoryKey: PublicKey, botId: number, programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('bot'), factoryKey.toBuffer(), new BN(botId).toArrayLike(Buffer, 'le', 8)], programId);
}

export function getHolderPDA(botKey: PublicKey, holderKey: PublicKey, programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('holder'), botKey.toBuffer(), holderKey.toBuffer()], programId);
}
