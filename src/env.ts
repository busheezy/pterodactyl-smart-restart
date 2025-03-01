import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PTERO_URL: z.string().url(),
  PTERO_API_KEY: z.string(),
  DISCORD_WEBHOOK_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
