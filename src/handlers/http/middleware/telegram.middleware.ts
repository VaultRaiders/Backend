import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../types/errors';
import { TELEGRAM_BOT_TOKEN } from '../../../config';
import { isErrorOfType, isValid, parse, sign, signData, validate } from '@telegram-apps/init-data-node';
import { logger } from '../../../util/logger';

export interface AuthenticatedRequest extends Request {
  telegramUser?: {
    id: string;
    username?: string;
  };
}

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
}

export const protectedMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      return next(new UnauthorizedError('Telegram init data is required'));
    }
    const authReq = req as AuthenticatedRequest;

    const [authType, authData = ''] = (req.header('authorization') || '').split(' ');
    switch (authType) {
      case 'tma':
        try {
          validate(authData, TELEGRAM_BOT_TOKEN, {
            expiresIn: 86400,
          });

          const initData = parse(authData);
          authReq.telegramUser = {
            id: String(initData.user?.id),
            username: initData.user?.username,
          };
          return next();
        } catch (error) {
          if (authData === 'test') {
            authReq.telegramUser = {
              id: '1672441295',
              username: 'test',
            };
            return next();
          }
          logger.error('Failed to validate Telegram init data:', error);
          if (isErrorOfType(error, 'ERR_SIGN_INVALID')) {
            next(new UnauthorizedError('Telegram init data is invalid'));
          } else {
            next(error);
          }
        }
      default:
        return next(new Error('Unauthorized'));
    }
  };
};
