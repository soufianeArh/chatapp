import { Conversation } from "@/types/conversation";

export const serialize = (conv: Conversation): string=>{
      return JSON.stringify({
            ...conv,
            createdAt: conv.createdAt.toISOString(),
            updatedAt: conv.updatedAt.toISOString(),
      })
}

export const deserialize = (raw: string): Conversation =>{
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