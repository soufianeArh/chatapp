import { getRedisClient } from "@/clients/redis.client";
import { Conversation } from "@/types/conversation";

const CACHE_PREFIX="converation";
const CACHE_TTL = 60;

const serialize = (conv: Conversation): string=>{
      return JSON.stringify({
            ...conv,
            createdAt: conv.createdAt.toISOString(),
            updatedAt: conv.updatedAt.toISOString(),
      })
}

const deserialize = (raw: string): Conversation =>{
      const parsed =  JSON.parse(raw) as Conversation & {
            createdAt: string
            updatedAt: string
      };
      return {
            ...parsed,
            createdAt: new Date(parsed.createdAt),
            updatedAt: new Date(parsed.updatedAt)
      }
}

export const cacheConversationRepo = {
      async get(conversationId: string): Promise<Conversation | null> {
        const redis = getRedisClient();
        const payload = await redis.get(`${CACHE_PREFIX}${conversationId}`);
        return payload ? deserialize(payload) : null;
      },
      async set(converation: Conversation): Promise<void>{
            const redis = getRedisClient();
            await redis.setex(
                  `${CACHE_PREFIX}${converation.id}`,
                  CACHE_TTL,
                  serialize(converation)
            )
      },
      async delete(conversationId:string): Promise<void> {
            const redis = getRedisClient();
            await redis.del(`${CACHE_PREFIX}${conversationId}`);
      }

    };