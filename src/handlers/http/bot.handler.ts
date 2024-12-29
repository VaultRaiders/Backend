import { Router } from 'express';
import { Request, Response } from 'express';
import { BotService } from '../../services/bot.service';
import { validate } from './middleware/validate.middleware';
import {
  getListBotsSchema,
  getBotSchema,
  createBotSchema,
  generateBotDataSchema,
  generateBotAvatarSchema,
  IGetListBotsQuery,
  buyTicketSchema,
} from '../../types/validations/bot.validation';
import { asyncHandler } from './middleware/error.middleware';
import { sendAccepted, sendPaginated, sendSuccess } from '../../util/response';
import { UnauthorizedError } from '../../types/errors';
import { AuthenticatedRequest, protectedMiddleware } from './middleware/telegram.middleware';
import { UserService } from '../../services/user.service';

export class BotRouter {
  private router: Router;
  private controller: BotController;

  constructor() {
    this.router = Router();
    this.controller = new BotController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', validate(getListBotsSchema), asyncHandler(this.controller.getListBots));
    this.router.get('/me/list', protectedMiddleware(), asyncHandler(this.controller.getMyBots));
    this.router.get('/recent', protectedMiddleware(), asyncHandler(this.controller.getRecentBots));
    this.router.get('/stats', protectedMiddleware(), asyncHandler(this.controller.getStats));
    this.router.post('/generate-bot-data', protectedMiddleware(), validate(generateBotDataSchema), asyncHandler(this.controller.generateBotData));
    this.router.post(
      '/generate-bot-avatar',
      protectedMiddleware(),
      validate(generateBotAvatarSchema),
      asyncHandler(this.controller.generateBotAvatar),
    );
    this.router.get('/:id', protectedMiddleware(), validate(getBotSchema), asyncHandler(this.controller.getBot));
    this.router.get('/:id/chat-history', protectedMiddleware(), asyncHandler(this.controller.getBotChatHistory));

    this.router.post('/', validate(createBotSchema), protectedMiddleware(), asyncHandler(this.controller.createBot));
    this.router.post('/:id/buy-ticket', protectedMiddleware(), validate(buyTicketSchema), asyncHandler(this.controller.buyTicket));
    this.router.post('/:id/start', protectedMiddleware(), asyncHandler(this.controller.startChat));
  }

  public getRouter(): Router {
    return this.router;
  }
}

export class BotController {
  private botService = BotService.getInstance();
  private userService = UserService.getInstance();

  constructor() {}

  public getListBots = async (req: Request, res: Response): Promise<void> => {
    const query: IGetListBotsQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
      ...req.query,
    };

    const { bots, total } = await this.botService.getListBots(query);
    sendPaginated(res, bots, query.page, query.limit, total);
  };

  public getBot = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const telegramUser = authReq.telegramUser!;

    const botId = req.params.id;
    const bot = await this.botService.getBotByUser(botId, telegramUser.id);

    sendSuccess(res, bot);
  };

  public getMyBots = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const telegramUser = authReq.telegramUser!;

    const bots = await this.botService.getMyBots(String(telegramUser.id));
    sendSuccess(res, bots);
  };

  public getRecentBots = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const telegramUser = authReq.telegramUser!;

    const bots = await this.botService.getRecentBots(String(telegramUser.id));
    sendSuccess(res, bots);
  };

  public generateBotData = async (req: Request, res: Response): Promise<void> => {
    const body = req.body;
    const botData = await this.botService.generateBotData(body.ideas);
    sendSuccess(res, botData);
  };

  public generateBotAvatar = async (req: Request, res: Response): Promise<void> => {
    const body = req.body;
    const avatar = await this.botService.generateBotAvatar(body.avatarDescription);

    sendSuccess(res, avatar);
  };

  public createBot = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const telegramUser = authReq.telegramUser!;

    const body = req.body;
    const password = body.password;
    delete body.password;

    const bot = await this.botService.createBot(telegramUser.id, req.body, password);

    sendSuccess(res, bot);
  };

  public startChat = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const telegramUser = authReq.telegramUser!;

    const botId = req.params.id;

    const user = await this.userService.getUserById(telegramUser.id);
    const bot = await this.botService.getBot(botId);

    await this.userService.updateCurrentBot(user.id, bot.id);
    this.botService.sendBotGreeting(user, bot);

    sendAccepted(res, {});
  };

  public buyTicket = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const telegramUser = authReq.telegramUser!;

    const botId = req.params.id;
    const body = req.body;

    await this.botService.buyTicket(botId, telegramUser.id, body.password);

    sendAccepted(res, {});
  };

  public getBotChatHistory = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const telegramUser = authReq.telegramUser!;

    const botId = req.params.id;
    const body = req.body;

    const chatHistory = await this.botService.getBotChatHistory(botId);

    sendSuccess(res, chatHistory);
  };
  public getStats = async (req: Request, res: Response): Promise<void> => {
    const botStats = await this.botService.getBotStats();
    sendSuccess(res, botStats);
  };
}
