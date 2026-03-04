import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { userRepository } from "@/repositories/user.repository";
import {  type ChannelModel,  type Channel, type Replies, connect, ConsumeMessage } from "amqplib";
import { USER_EVENTS_EXCHANGE, USER_CREATED_ROUTING_KEY, UserCreatedEvent } from "@chatapp/common";

let connectionRef: ChannelModel | null = null;
let channelRef: Channel | null = null;
let consumerTag: string | null = null;

const EVENT_QUEUE = 'chat-service.user-events';

const handleUserCreated = async(event:UserCreatedEvent)=>{
      await userRepository.upsertUser(event.payload);
}

const closeAmqpConnection = async (conn: ChannelModel) => {
      await conn.close();
    };
    
//START CONNECTION
export const startConsumer = async ()=>{
      if(!env.RABBITMQ_URL){
            logger.info('RabbitMQ URL not configured; consumers disabled');
            return;
      };
      const conn = await connect(env.RABBITMQ_URL);
      connectionRef = conn
      const ch = await conn.createChannel();
      channelRef = ch;

      await ch.assertExchange(USER_EVENTS_EXCHANGE, 'topic', { durable: true });
      const queue = await ch.assertQueue(EVENT_QUEUE, { durable: true });
      await ch.bindQueue(queue.queue, USER_EVENTS_EXCHANGE, USER_CREATED_ROUTING_KEY);

      const consumeHandler = (msg: ConsumeMessage | null)=>{
            if(!msg){
                  return;
            }
            void (
                  async ()=>{
                        const payload = msg.content.toString('utf-8');
                        const event = JSON.parse(payload) as UserCreatedEvent;
                        await handleUserCreated(event)
                        ch.ack(msg)
                  })().catch((error: unknown) => {
                        logger.error({ err: error }, 'Failed to process event');
                        ch.nack(msg, false, false);}
                  )}
      const result: Replies.Consume = await ch.consume(queue.queue, consumeHandler);
      consumerTag = result.consumerTag;
      logger.info('RabbitMQ consumer started');
}

export const stopConsumers = async () => {
      try {
        const ch = channelRef;
        if (ch && consumerTag) {
          await ch.cancel(consumerTag);
          consumerTag = null;
        }
        if (ch) {
          await ch.close();
          channelRef = null;
        }
        const conn = connectionRef;
        if (conn) {
          await closeAmqpConnection(conn);
          connectionRef = null;
        }
      } catch (error) {
        logger.error({ err: error }, 'Error stopping RabbitMQ consumer');
      }
    };