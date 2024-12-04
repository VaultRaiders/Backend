import { z } from 'zod';

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
  }),
});

export const getBotSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const createBotSchema = z.object({
  body: z.object({
    displayName: z.string().min(1).max(255),
    bio: z.string().optional(),
    prompt: z.string(),
    initKeys: z.number().int().min(0),
    password: z.string(),
  }),
});

export const generateBotDataFromIdeaSchema = z.object({
  body: z.object({
    idea: z.string(),
  }),
});
