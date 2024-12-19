import { JsonRpcProvider, Wallet, parseEther, formatEther } from 'ethers';
import { db } from '../infra/db';
import { eq } from 'drizzle-orm';
import * as crypto from 'crypto';
import { wallets } from '../infra/schema';
import { OWNER_PRIVATE_KEY, RPC_URL } from '../config';

export class WalletService {
  private static instance: WalletService;
  public provider: JsonRpcProvider;

  private constructor() {
    this.provider = new JsonRpcProvider(RPC_URL || 'http://localhost:8545');
  }

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  private encryptPrivateKey(privateKey: string, password: string): string {
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return JSON.stringify({
      salt: salt.toString('hex'),
      iv: iv.toString('hex'),
      encrypted,
    });
  }

  private decryptPrivateKey(encryptedData: string, password: string): string {
    const { salt, iv, encrypted } = JSON.parse(encryptedData);
    const key = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 100000, 32, 'sha256');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  async createWallet(userId: string, password: string) {
    const existingWallet = await db.select().from(wallets).where(eq(wallets.userId, userId));
    if (existingWallet.length > 0) {
      throw new Error('Wallet already exists for this user');
    }

    const wallet = Wallet.createRandom();
    const privateKey = wallet.privateKey;
    const encryptedKey = this.encryptPrivateKey(privateKey, password);

    await db.insert(wallets).values({
      userId,
      address: wallet.address.toLocaleLowerCase(),
      encryptedKey,
      isActive: true,
    });

    return { address: wallet.address.toLocaleLowerCase(), privateKey };
  }

  async importWallet(userId: string, privateKey: string, password: string) {
    const existingWallet = await db.select().from(wallets).where(eq(wallets.userId, userId));
    if (existingWallet.length > 0) {
      throw new Error('Wallet already exists for this user');
    }

    const wallet = new Wallet(privateKey);
    const encryptedKey = this.encryptPrivateKey(privateKey, password);

    await db.insert(wallets).values({
      userId,
      address: wallet.address,
      encryptedKey,
      isActive: true,
    });

    return { address: wallet.address };
  }

  async getWallet(userId: string, password: string): Promise<Wallet> {
    const userWallet = await db.select().from(wallets).where(eq(wallets.userId, userId));
    if (userWallet.length === 0) {
      throw new Error('No wallet found for this user');
    }

    const privateKey = this.decryptPrivateKey(userWallet[0].encryptedKey, password);
    return new Wallet(privateKey, this.provider);
  }

  async getWalletAddress(userId: string): Promise<string> {
    const userWallet = await db.select().from(wallets).where(eq(wallets.userId, userId));
    if (userWallet.length === 0) {
      throw new Error('No wallet found for this user');
    }
    return userWallet[0].address;
  }

  async deleteWallet(userId: string) {
    await db.delete(wallets).where(eq(wallets.userId, userId));
  }

  async getWalletInfo(userId: string) {
    const userWallet = await db.select().from(wallets).where(eq(wallets.userId, userId));
    if (userWallet.length === 0) return null;
    return userWallet[0];
  }

  async getBalance(address: string): Promise<bigint> {
    return await this.provider.getBalance(address);
  }

  async transferEth(userId: string, to: string, amount: number, password: string) {
    const wallet = await this.getWallet(userId, password);
    const balance = await this.getBalance(wallet.address);
    const amountWei = parseEther(amount.toString());

    if (balance < amountWei) {
      throw new Error('Insufficient balance');
    }

    const tx = await wallet.sendTransaction({
      to: to,
      value: amountWei,
    });

    await this.confirmTransaction(tx.hash);
  }

  public async confirmTransaction(txHash: string): Promise<void> {
    try {
      const tx = await this.provider.getTransaction(txHash);
      if (!tx) {
        throw new Error('Transaction not found');
      }

      const receipt = await tx.wait();
      if (!receipt || receipt.status === 0) {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Transaction confirmation failed:', error);
      throw new Error('Transaction confirmation failed');
    }
  }

  public async getOwnerWallet(): Promise<Wallet> {
    return new Wallet(OWNER_PRIVATE_KEY, this.provider);
  }
}
