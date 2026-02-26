import {
      USER_EVENTS_EXCHANGE,
      USER_CREATED_ROUTING_KEY,
      type UserCreatedEvent,
      type UserCreatedPayload,
}
      from "@chatapp/common";
import {connect, type Channel, type ChannelModel, type Connection} from "amqplib";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

type ManagedConnection =
  Connection & Pick<ChannelModel, 'close' | 'createChannel'>;

let connectionRef: ManagedConnection | null = null;
let channel : Channel | null = null;

const messagingEnabled = Boolean(env.RABBITMQ_URL);



export const ensureChannel = async () : Promise<Channel | null>=>{
      if (!env.RABBITMQ_URL) {
            return null;
          };
      if(!messagingEnabled){
            return null;
      }
      if(channel){
            return channel;
      };
      const connection = (await connect(env.RABBITMQ_URL)) as unknown as ManagedConnection ;
      connectionRef = connection;
      channel = await connection.createChannel();
      await channel.assertExchange(USER_EVENTS_EXCHANGE, "topic", {durable: true});

      connection.on("close", ()=>{
            logger.warn("Rabbit MQ connection closed");
            channel= null
            connectionRef = null

      });
      connection.on("error", (error)=>{
            logger.error({err: error},"Rabbit MQ connection failed onErr")
      });
      logger.info("Rabbit mq publisher inistialized");
      return channel;
};

export const initMessaging = async ()=>{
      if(!messagingEnabled){
            logger.info('RabbitMQ URL is not configured; messaging disabled');
            return;
      };
      await ensureChannel()
}

export const userCreatedPublish = async (payload: UserCreatedPayload)=>{
      const ch =  await ensureChannel()
      if(!ch){
            logger.warn("Rabbit MQ is not initialized, message cant be sent")
            return;
      };
      const event: UserCreatedEvent = {
            type:USER_CREATED_ROUTING_KEY,
            payload,
            occuredAt: new Date().toISOString(),
            metadata: { version: 1 },
      };
      try{
            const published = ch.publish(
                  USER_EVENTS_EXCHANGE,
                  USER_CREATED_ROUTING_KEY,
                  Buffer.from(JSON.stringify(event)),
                  { contentType: 'application/json', persistent: true },
            );
            logger.info('user created event published');

            if(!published){
                  logger.warn({ event }, 'Failed (false) to publish user registered event');
            }
      }catch(err){
            logger.warn({ err }, 'Failed (thrown) to publish user registered event');

      }
     
}

export const closeMessaging = async ()=>{
      try{
            const ch = channel;
            if(ch){
                  await ch.close();
                  channel = null
            };
            const conn = connectionRef;
            if(conn){
                  await conn.close();
                  connectionRef = null;
            }
      }catch(err){
            logger.error({err}, "Error closing RabbitMQ channel/connection")
      }
};