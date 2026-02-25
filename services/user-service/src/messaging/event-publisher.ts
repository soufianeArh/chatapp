import {
      USER_EVENTS_EXCHANGE,
      USER_CREATED_ROUTING_KEY,
      type UserCreatedEvent,
      type UserCreatedPayload,
}
      from "@chatapp/common";
import {connect, type Channel, type ChannelModel} from "amqplib";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

let connectionRef : ChannelModel | null = null;
let channel : Channel | null = null;


export const initPublisher = async () : Promise<void>=>{

      if(!env.RABBITMQ_URL){
            logger.warn("Rabbitmq url not found ! initialized service without Broker connection")
            return;
      };
      if(channel){
            return;
      };
      const connection = await connect(env.RABBITMQ_URL);
      connectionRef = connection;
      channel = await connection.createChannel();
      await channel.assertExchange(USER_EVENTS_EXCHANGE, "topic", {durable: true});

      connection.on("close", ()=>{
            logger.warn("Rabbit MQ connection closed");
            channel= null
            connectionRef = null

      });
      connection.on("error", ()=>{
            logger.error("Rabbit MQ connection failed onErr")
      });

      logger.info("Rabbit mq publisher inistialized")
}


export const userCreatedPublish = (payload: UserCreatedPayload)=>{
      if(!channel){
            logger.warn("Rabbit MQ is not initialized, message cant be sent")
            return;
      };
      const event: UserCreatedEvent = {
            type:USER_CREATED_ROUTING_KEY,
            payload,
            occuredAt: new Date().toISOString(),
            metadata: { version: 1 },
      };
      const published = channel.publish(
            USER_EVENTS_EXCHANGE,
            USER_CREATED_ROUTING_KEY,
            Buffer.from(JSON.stringify(event)),
            { contentType: 'application/json', persistent: true },
      );
      if(!published){
            logger.warn({ event }, 'Failed to publish user registered event');
      }
}

export const closePublisher = async ()=>{
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