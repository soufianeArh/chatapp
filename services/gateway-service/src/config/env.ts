import {z, createEnv} from "@chatapp/common";
import 'dotenv/config';

const envSchema = z.object({
      NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
      AUTH_SERVICE_URL: z.url(),
      GATEWAY_PORT: z.coerce.number().int().min(0).max(65_535).default(4000),
      INTERNAL_API_TOKEN: z.string().min(10)
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(
      envSchema,{
      serviceName:"gateway-service"
});
