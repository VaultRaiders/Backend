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

export interface ChatMessageResponse {
  id: string | null;
  text: string | null;
  senderRole: string | null;
  createdAt: Date | null;
}