import type { Conversation, ConversationFilter, ConversationSummary, CreateConversationInput } from "@/types/conversation";
import { getMongoClient } from "@/clients/mongo.client";
import { type WithId, type Document, Collection, ObjectId } from "mongodb";
import { randomUUID } from "crypto";
import { title } from "process";

const CONVERSATION_COLLECTION = "conversations";
const MESSAGES_COLLECTION = "messages";

//trust createdAt/updatedAt
const toConversation = (doc: WithId<Document>) : Conversation =>({
      id: String(doc._id),
      title: doc.title === "string"? doc.title : null,
      participantIds: Array.isArray(doc.participantIds)? doc.participantIds as string[]: [],
      createdAt: new Date(doc.createdAt as string | number | Date),
      updatedAt: new Date(doc.updatedAt as string | number | Date),
      lastMessageAt: doc.lastMessageAt ? new Date(doc.lastMessageAt as string | number | Date) : null,
      lastMessagePreview: typeof doc.lastMessagePreview === 'string' ? doc.lastMessagePreview : null,
})

export const converstationRepository = {
      async create(input:CreateConversationInput): Promise<Conversation>{
            const client = await getMongoClient();
            const db = client.db()
            const collection = db.collection(CONVERSATION_COLLECTION)
            const now = new Date()
            const document = {
                  _id: randomUUID(),
                  title: input.title ?? null,
                  participantIds: input.participantIds,
                  createdAt: now,
                  updatedAt: now,
                  lastMessageAt: null,
                  lastMessagePreview: null
            };
            await collection.insertOne(document as unknown as WithId<Document>)
            return toConversation(document as unknown as WithId<Document>);
      },
      async findById(id: string){
            const client = await getMongoClient();
            const db = client.db()
            const collection = db.collection(CONVERSATION_COLLECTION)
            const doc = await collection.findOne({_id: id as unknown as ObjectId})
            return doc ? toConversation(doc) : null;
      },
      async findSummaries(filter : ConversationFilter){
            const client = await getMongoClient();
            const db = client.db()
            const cursor = db
            .collection(CONVERSATION_COLLECTION)
            .find({ participantIds: filter.participantId })
            .sort({ lastMessageAt:-1, updatedAt:-1 })
            const results = await cursor.toArray();
            return results.map((doc)=> toConversation(doc))

      },
      async touchConversation(id: string, preview: string):  Promise<void>{
            const client = await getMongoClient();
            const db = client.db()
            const collection = db.collection(CONVERSATION_COLLECTION)
            await collection.updateOne(
                  {_id: id as unknown as ObjectId},
                  {
                        $set: {
                              lastMessageAt: new Date(),
                              lastMessagePreview: preview,
                              updatedAt: new Date(),
                            },
                  }
            )
      },
      async removeAll(): Promise<void> {
            const client = await getMongoClient();
            const db = client.db();
            await Promise.all([
              db.collection(CONVERSATION_COLLECTION).deleteMany({}),
              db.collection(MESSAGES_COLLECTION).deleteMany({}),
            ]);
          },

}