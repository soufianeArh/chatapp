import type { ZodObject, ZodRawShape } from "zod";
interface EnvOptions {
      source?: NodeJS.ProcessEnv,
      serviceName?:string
};

type SchemaOutput<TSschema extends ZodRawShape> = ZodObject<TSschema>["_output"]

export const createEnv = <TSschema extends ZodRawShape>(
      schema:ZodObject<TSschema>,
      options:EnvOptions = {}
): SchemaOutput<TSschema>=>{
      const {source = process.env, serviceName="service"} = options;
      const parsed = schema.safeParse(source);
      if(!parsed.success){
            const formatedErrors = parsed.error.format();
            throw new Error(
                   `[${serviceName}] Environment variable validation failed: ${JSON.stringify(formatedErrors)}`
            )
      }

      return parsed.data;
};

export type EnvSchema<TShape extends ZodRawShape> = ZodObject<TShape>;