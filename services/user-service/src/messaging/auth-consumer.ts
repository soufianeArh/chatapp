import {
      AUTH_EVENT_EXCHANGE,
      AUTH_USER_REGISTERED_ROUTER_KEY,
      type AuthUserRegisteredPayload
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
