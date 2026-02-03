import 'dotenv/config';
import { z , createEnv } from "@chatapp/common";

const envSchema = z.object({
      NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
      USER_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4001),
      INTERNAL_API_TOKEN: z.string().min(10),
      RABBITMQ_URL: z.url(),
      USER_DB_URL: z.url()

    });

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: 'user-service',
 });
 console.log(env.USER_DB_URL)
 export type Env = typeof env;