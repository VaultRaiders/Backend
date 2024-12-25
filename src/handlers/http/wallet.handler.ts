import { Router } from 'express';
import { Request, Response } from 'express';
import { UserService } from '../../services/user.service';
import { asyncHandler } from './middleware/error.middleware';
import { sendCreated, sendSuccess } from '../../util/response';
import { AuthenticatedRequest, protectedMiddleware } from './middleware/telegram.middleware';
import { WalletService } from '../../services/wallet.service';

export class WalletRouter {
  private router: Router;
  private controller: WalletController;

  constructor() {
    this.router = Router();
    this.controller = new WalletController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', protectedMiddleware(), asyncHandler(this.controller.getWallet));
  }

  public getRouter(): Router {
    return this.router;
  }
}

export class WalletController {
  private walletService: WalletService;

  constructor() {
    this.walletService = WalletService.getInstance();
  }

  public getWallet = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const telegramUser = authReq.telegramUser!;

    const address = await this.walletService.getWalletAddress(telegramUser.id);
    const balance = await this.walletService.getBalance(address);
    sendSuccess(res, {
      address,
      balance: balance.toString(),
    });
  };
}
