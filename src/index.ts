import { SERVER_PORT, TELEGRAM_BOT_TOKEN } from './config';
import { HttpServer } from './handlers/http';
import { TelegramBot } from './handlers/telegram';
import { ScheduleService } from './services/schedule.service';

interface ServerState {
  isShuttingDown: boolean;
}

class ApplicationServer {
  private readonly httpServer: HttpServer;
  private readonly telegramBot: TelegramBot;
  private readonly state: ServerState;
  private readonly scheduleService: ScheduleService

  constructor() {
    this.state = { isShuttingDown: false };
    this.telegramBot = new TelegramBot();
    this.httpServer = new HttpServer(this.state);
    this.scheduleService = ScheduleService.getInstance()
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    console.log(`\n[${signal}] Graceful shutdown initiated...`);
    this.state.isShuttingDown = true;

    try {
      // Stop HTTP server
      await this.httpServer.stop();
      console.log('Express server closed');

      // Stop Telegram bot
      await this.telegramBot.stop();
      console.log('Telegram bot stopped');

      // Allow some time for ongoing requests to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  }

  public async start(): Promise<void> {
    try {
      // Setup signal handlers
      ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
        process.on(signal, () => this.gracefulShutdown(signal));
      });

      // Start HTTP server
      await this.httpServer.start(SERVER_PORT);
      console.log(`[${new Date().toISOString()}] Server is running on port ${SERVER_PORT}`);

      // Schedule Service
      this.scheduleService.start()
      console.log(`[${new Date().toISOString()}] Schedule service started successfully`);

      // Start Telegram bot
      await this.telegramBot.launch();
      console.log(`[${new Date().toISOString()}] Telegram bot started successfully`);

      // Log startup complete
      console.log(`[${new Date().toISOString()}] Application startup completed`);
    } catch (error) {
      console.error('Fatal error during startup:', error);
      process.exit(1);
    }
  }
}

// Start the application
const server = new ApplicationServer();
server.start().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});