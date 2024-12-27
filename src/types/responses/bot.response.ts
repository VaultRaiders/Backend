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

export interface IBotDataResponse {
  name: string;
  backStory: string;
  systemInstruction: string;
  photoUrl: string;
}

export interface ChatMessageResponse {
  id: string | null;
  text: string | null;
  senderRole: string | null;
  createdAt: Date | null;
}

export interface IBotStat {
  totalPrice?: string;
  playingNumbers?: number;
  playingUsers?: number;
  totalBots: number;
}
