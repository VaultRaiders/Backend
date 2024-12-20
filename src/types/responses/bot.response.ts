import { Bot } from '../../infra/schema';

export interface GetListBotsResponse {
  bots: Bot[];
  total: number;
}

export interface IBotResponse extends Bot {
  balance: string;
  ticketPrice: string;
  hasActiveTicket?: boolean;
}
