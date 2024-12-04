import { Router } from 'express';
import { Request, Response } from 'express';
import { UserService } from '../../services/user.service';
import { asyncHandler } from './middleware/error.middleware';
import { sendCreated, sendSuccess } from '../../util/response';
import { AuthenticatedRequest, protectedMiddleware } from './middleware/telegram.middleware';

export class UserRouter {
  private router: Router;
  private controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/me', protectedMiddleware(), asyncHandler(this.controller.getProfile)); 
  }

  public getRouter(): Router {
    return this.router;
  }
}

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = UserService.getInstance();
  }

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const telegramUser = authReq.telegramUser!;

    const profile = await this.userService.getUserById(telegramUser.id);
    sendSuccess(res, profile);
  }; 
}
