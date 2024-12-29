import { z } from 'zod';

export interface IGetListBotsQuery {
  limit: number;
  page: number;
  isActive?: boolean;
  search?: string;
  orderBy?: string;
  sort?: 'asc' | 'desc';
  createdBy?: string;
}

export const getListBotsSchema = z.object({
  query: z.object({
    limit: z
      .string()
      .optional()
      .transform((val) => Number(val) || 20),
    page: z
      .string()
      .optional()
      .transform((val) => Number(val) || 1),
    isActive: z
      .enum(['true', 'false'])
      .optional()
      .transform((val) => val === 'true'),
    search: z.string().optional(),
    orderBy: z.string().optional(),
    sort: z
      .enum(['asc', 'desc'])
      .optional()
      .transform((val) => val || 'asc'),
  }),
});

export const buyTicketSchema = z.object({
  body: z.object({
    password: z.string(),
  }),
});

export const getBotSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const createBotSchema = z.object({
  body: z.object({
    displayName: z.string().min(1).max(255),
    bio: z.string().optional(),
    prompt: z.string(),
    photoUrl: z.string(),
    initPrice: z.string().optional(),
    password: z.string(),
  }),
});

export const generateBotDataSchema = z.object({
  body: z
    .object({
      ideas: z.string().optional(),
    })
    .optional(),
});

export const generateBotAvatarSchema = z.object({
  body: z
    .object({
      avatarDescription: z.string().optional(),
    })
    .optional(),
});
