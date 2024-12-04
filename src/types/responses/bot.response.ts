import { Bot } from "../../infra/schema";

export interface GetListBotsResponse {
    bots: Bot[];
    total: number;
}