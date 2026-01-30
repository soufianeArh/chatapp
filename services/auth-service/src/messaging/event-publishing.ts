import {
      AUTH_EVENT_EXCHANGE,
      AUTH_USER_REGISTERED_ROUTER_KEY,
      type AuthUserRegisteredPayload
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
      await channel.assertExchange(AUTH_EVENT_EXCHANGE, "topic", {durable: true});

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
