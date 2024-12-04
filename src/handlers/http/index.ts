import cors from 'cors';
import express, { Application } from 'express';
import { BotRouter } from './bot.handler';
import { UserRouter } from './user.handler';
import { errorLoggingMiddleware, loggingMiddleware, performanceMiddleware } from './middleware/logging.middleware';
import { errorHandler } from './middleware/error.middleware';
import { logger } from '../../util/logger';

interface ServerState {
  isShuttingDown: boolean;
}

export class HttpServer {
  private readonly app: Application;
  private readonly botRouter: BotRouter;
  private readonly userRouter: UserRouter;
  private server: any;
  private readonly state: ServerState;

  constructor(state: ServerState) {
    this.app = express();
    this.state = state;
    this.botRouter = new BotRouter();
    this.userRouter = new UserRouter();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(loggingMiddleware);
    this.app.use(performanceMiddleware);
  }

  private initializeRoutes(): void {
    // CORS preflight
    this.app.options('*', (_, res) => {
      res.sendStatus(200);
    });

    // Health check endpoint
    this.app.get('/health', (_, res) => {
      res.status(this.state.isShuttingDown ? 503 : 200).json({
        status: this.state.isShuttingDown ? 'shutting_down' : 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    const apiV1Router = express.Router();
    apiV1Router.use('/user', this.userRouter.getRouter());
    apiV1Router.use('/bot', this.botRouter.getRouter());
    this.app.use('/api/v1', apiV1Router);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorLoggingMiddleware);
    this.app.use(errorHandler);
  }

  public async start(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(port, () => {
          logger.info(`Server started on port ${port}`);
          resolve();
        });
      } catch (error) {
        logger.error('Failed to start server:', error);
        reject(error);
      }
    });
  }

  public async stop(): Promise<void> {
    if (this.server) {
      logger.info('Stopping server...');
      return new Promise((resolve) => {
        this.server.close(() => {
          logger.info('Server stopped');
          resolve();
        });
      });
    }
  }
}
