import {
      AUTH_EVENT_EXCHANGE,
      AUTH_USER_REGISTERED_ROUTER_KEY,
      type AuthUserRegisteredPayload,
      type AuthRegisteredEvent
}
      from "@chatapp/common";
import {
      connect,
      type Channel,
      type ChannelModel,
      type Connection,
      type ConsumeMessage,
      type Replies
}
      from "amqplib";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { userService } from "@/services/user.service";

type ManageConnection = Connection & ChannelModel

let connectionRef: ManageConnection | null = null;
let channel : Channel | null = null;
let consumerTag : string | null = null;

const QUEUE_NAME = 'auth-service.auth-events';

//why just a function that takes conn ... ???
const closeConnection = async (conn:ManageConnection)=>{
      await conn.close();
      connectionRef = null;
      channel = null;
      consumerTag = null;
};

//this function aims to ack
const handleMessage = async (message: ConsumeMessage, ch: Channel) => {
      const raw = message.content.toString("utf-8");
      const event = JSON.parse(raw) as AuthRegisteredEvent;

      await userService.syncFromAuthUser(event.payload);
      ch.ack(message);
};

export const startAuthEventConsumer = async () => {
      // i need to create a tcp stream connection that brings event and ack
      if(!env.RABBITMQ_URL){
            logger.warn("Rabbit MQ url is not configured");
            return;
      };
      if(channel){
            return;
      };
      //lets create the connection + channel 
      const connection = (await connect(env.RABBITMQ_URL)) as ManageConnection;
      connectionRef = connection; //the value stays the same
      const ch = await connection.createChannel(); //connection / connectionRef is the same here 
      channel = ch;

      await ch.assertExchange(AUTH_EVENT_EXCHANGE, 'topic', { durable: true }); //makes amqplib to declare an exchange 
      const queue = await ch.assertQueue(QUEUE_NAME, { durable: true });
      //binding the queue 
      await ch.bindQueue(queue.queue, AUTH_EVENT_EXCHANGE, AUTH_USER_REGISTERED_ROUTER_KEY);

      const consumerHandler = (msg: ConsumeMessage | null )=>{
            if(!msg){
                  return;
            }
            void handleMessage(msg, ch).catch(err=>{
                  logger.error({err}, "Error happened in consumerHandle");
                  ch.nack(msg)
            })
      }
      const result: Replies.Consume = await ch.consume(queue.queue, consumerHandler);
      consumerTag = result.consumerTag;

      connection.on("close", ()=>{
            logger.warn('Auth consumer connection closed');
            connectionRef = null;
            channel = null;
            consumerTag = null;
      })
      logger.info("Auth consumer is connected")
};

export const stopEventConsumer = async()=>{
      try{
            const ch = channel;
            if(ch && consumerTag){
                  await ch.cancel(consumerTag);
                  consumerTag = null;
            };
            if(ch){
                  await ch.close()
                  channel=null
            };
            const conn = connectionRef;
            if (conn) {
              await closeConnection(conn);
              connectionRef = null;
            }
        
      }catch(err){
            logger.error({err}, "Failed to stop auth consumer event")
      }
}
