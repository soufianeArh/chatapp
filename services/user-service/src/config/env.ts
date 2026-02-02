import 'dotenv/config';
import { z , createEnv } from "@chatapp/common";

console.log("env.ts",process.env.NODE_ENV === "development") 

const envSchema = z.object({
      NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
      USER_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4002),
      INTERNAL_API_TOKEN: z.string().min(10)
    });

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: 'user-service',
 });
console.log(env)
 export type Env = typeof env;