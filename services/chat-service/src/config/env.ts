import 'dotenv/config';
import { z , createEnv } from "@chatapp/common"

const envSchema = z.object({
      NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
      CHAT_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4003),
      CHAT_db_URL: z.string().url(),
      // JWT_SECRET:z.string().min(6),
      // INTERNAL_API_TOKEN:z.string().min(10),
      RABBITMQ_URL: z.url(),
      REDIS_URL:z.url()
    });

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: 'chat-service',
 });

 export type Env = typeof env;